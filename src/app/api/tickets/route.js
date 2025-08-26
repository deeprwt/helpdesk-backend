import prisma from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, createdById, priority } = body;

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority,
        createdById,
      },
    });

    return new Response(JSON.stringify(ticket), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

export async function GET() {
  try {
    const tickets = await prisma.ticket.findMany({
      include: {
        createdBy: true,
        assignedTo: true,
        comments: true,
      },
    });
    return new Response(JSON.stringify(tickets), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
