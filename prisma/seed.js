// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Seed Users
  await prisma.user.createMany({
    data: [
      {
        name: "Admin User",
        email: "admin@example.com",
        passwordHash: await bcrypt.hash("admin123", 10),
        role: "ADMIN",
      },
      {
        name: "Agent User",
        email: "agent@example.com",
        passwordHash: await bcrypt.hash("agent123", 10),
        role: "AGENT",
      },
      {
        name: "Normal User",
        email: "user@example.com",
        passwordHash: await bcrypt.hash("user123", 10),
        role: "USER",
      },
    ],
  });

  // Seed SLA Policies
  await prisma.sLAPolicy.createMany({
    data: [
      {
        name: "Standard SLA",
        priority: "MEDIUM",
        responseTimeMins: 60,
        resolutionTimeMins: 1440, // 24h
      },
      {
        name: "High Priority SLA",
        priority: "HIGH",
        responseTimeMins: 30,
        resolutionTimeMins: 240, // 4h
      },
      {
        name: "Urgent SLA",
        priority: "URGENT",
        responseTimeMins: 10,
        resolutionTimeMins: 60, // 1h
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
