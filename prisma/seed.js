// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // Example seed users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: "hashedpassword",
        role: "ADMIN",
      },
      {
        name: "Agent User",
        email: "agent@example.com",
        passwordHash: "hashedpassword",
        role: "AGENT",
      },
    ],
  });
}

main()
  .then(async () => {
    console.log("Seeding finished ✅");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding error ❌", e);
    await prisma.$disconnect();
    process.exit(1);
  });
