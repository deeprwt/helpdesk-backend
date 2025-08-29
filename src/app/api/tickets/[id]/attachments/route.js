import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  try {
    const { id: ticketId } = params;

    // Parse incoming form data
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const attachment = await prisma.attachment.create({
      data: {
        filename: file.name,
        mimetype: file.type,
        size: buffer.length,
        data: buffer,
        ticketId,
      },
    });

    return NextResponse.json({ success: true, attachment });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
