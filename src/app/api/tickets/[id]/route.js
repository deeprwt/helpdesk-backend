import prisma from "@/lib/prisma";

// GET Ticket by ID
export async function GET(req, { params }) {
  const { id } = params;
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        createdBy: true,
        assignedTo: true,
        comments: { include: { user: true } },
      },
    });
    if (!ticket) return new Response("Not Found", { status: 404 });
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

// UPDATE Ticket (status, assignment, etc.)
export async function PATCH(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const ticket = await prisma.ticket.update({
      where: { id },
      data: body,
    });
    return new Response(JSON.stringify(ticket), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
