import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const body = await req.json();

    // ✅ First get current user from DB
    const existingUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        instagram: true,
      },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Allowed fields
    const allowedFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "bio",
      "facebook",
      "twitter",
      "linkedin",
      "instagram",
    ];

    // ✅ Merge values → prefer body, else DB, else blank
    const updateData = {};
    for (const key of allowedFields) {
      if (body[key] !== undefined) {
        updateData[key] = body[key];
      } else {
        updateData[key] = existingUser[key] ?? "";
      }
    }

    // ✅ Update user with merged data
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: updateData,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        bio: true,
        facebook: true,
        twitter: true,
        linkedin: true,
        instagram: true,
      },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (err) {
    console.error("Update profile error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
