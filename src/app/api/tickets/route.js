import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";

const prisma = new PrismaClient();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail", // replace with your email provider if different
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch tickets with related user and SLA info
    const [tickets, total] = await Promise.all([
      prisma.ticket.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: true,
          assignedTo: true,
          slaPolicy: true,
          attachments: true,
        },
      }),
      prisma.ticket.count(),
    ]);

    return NextResponse.json({
      tickets,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Fetch tickets error:", err);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Ticket fields
    const title = formData.get("title");
    const description = formData.get("description");
    const priority = formData.get("priority") || "MEDIUM";
    const slaPolicyId = formData.get("slaPolicyId");
    const createdById = formData.get("userId");
    const createdByName = formData.get("userName");
    const createdByEmail = formData.get("userEmail");

    // Attachments
    const files = formData.getAll("attachments");

    if (!title || !description || !createdById || !createdByEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ Create ticket
    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        createdById,
        createdByName,
        createdByEmail,
        slaPolicyId: slaPolicyId || null,
      },
    });

    // 2️⃣ Save attachments
    if (files && files.length > 0) {
      for (const file of files) {
        const buffer = Buffer.from(await file.arrayBuffer());
        await prisma.attachment.create({
          data: {
            fileUrl: file.name, // optional
            uploadedById: createdById,
            ticketId: ticket.id,
            data: buffer, // store binary in DB
          },
        });
      }
    }

    // 3️⃣ Log ticket creation event
    await prisma.ticketEvent.create({
      data: {
        type: "CREATED",
        message: `Ticket created by ${createdByName}`,
        ticketId: ticket.id,
      },
    });

    // 4️⃣ Send email to user
    await transporter.sendMail({
      from: `"Support Team" <${process.env.EMAIL_USER}>`,
      to: createdByEmail,
      subject: `Ticket Created: ${ticket.title}`,
      html: `
        <h3>Hi ${createdByName},</h3>
        <p>Your ticket has been created successfully.</p>
        <p><strong>Title:</strong> ${ticket.title}</p>
        <p><strong>Description:</strong> ${ticket.description}</p>
        <p><strong>Priority:</strong> ${ticket.priority}</p>
        <hr/>
        <small>Ticket ID: ${ticket.id}</small>
      `,
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error("Ticket creation error:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
