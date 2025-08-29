import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // ✅ Use correct case for Prisma model
    const policies = await prisma.sLAPolicy.findMany(); 
    return NextResponse.json(policies, { status: 200 });
  } catch (error) {
    console.error("Error fetching SLA policies:", error);
    return NextResponse.json({ error: "Failed to fetch SLA policies" }, { status: 500 });
  }
}
