import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // Parse FormData (files + ticketId)
    const formData = await req.formData();
    const ticketId = formData.get("ticketId");
    const files = formData.getAll("files");

    if (!ticketId) {
      return NextResponse.json(
        { error: "ticketId is required" },
        { status: 400 }
      );
    }

    // Make sure ticket exists
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    let uploadedFiles = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Save file to `/public/uploads`
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(uploadDir, fileName);

      await writeFile(filePath, buffer);

      // Save file record in DB (assuming you have TicketAttachment model)
      const attachment = await prisma.ticketAttachment.create({
        data: {
          ticketId,
          fileName: file.name,
          filePath: `/uploads/${fileName}`,
          mimeType: file.type,
          size: file.size,
        },
      });

      uploadedFiles.push(attachment);
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "File upload failed" },
      { status: 500 }
    );
  }
}
