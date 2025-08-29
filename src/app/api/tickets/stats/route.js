import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // make sure prisma client is exported correctly

export async function GET() {
  try {
    // Count tickets by status
    const total = await prisma.ticket.count();
    const open = await prisma.ticket.count({ where: { status: "OPEN" } });
    const inProgress = await prisma.ticket.count({ where: { status: "IN_PROGRESS" } });
    const hold = await prisma.ticket.count({ where: { status: "HOLD" } });
    const reopen = await prisma.ticket.count({ where: { status: "REOPENED" } });
    const rejected = await prisma.ticket.count({ where: { status: "REJECTED" } });
    const solved = await prisma.ticket.count({ where: { status: "RESOLVED" } });
    const closed = await prisma.ticket.count({ where: { status: "CLOSED" } });

    return NextResponse.json({
      total,
      open,
      inProgress,
      hold,
      reopen,
      rejected,
      solved,
      closed,
    }, { status: 200 });
  } catch (err) {
    console.error("Error fetching ticket stats:", err);
    return NextResponse.json({ error: "Failed to fetch ticket stats" }, { status: 500 });
  }
}
