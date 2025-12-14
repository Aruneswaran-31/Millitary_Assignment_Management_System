import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 🔹 Ensure ADMIN role exists
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  // 🔹 Ensure a base exists (VERY IMPORTANT)
  const defaultBase = await prisma.base.upsert({
    where: { name: "HQ" },
    update: {},
    create: { name: "HQ" },
  });

  // 🔹 Create admin user USING RELATIONS (NOT roleId)
  const passwordHash = await bcrypt.hash("adminpass", 10);

  await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@system.com",
      password: passwordHash,
      role: {
        connect: { id: adminRole.id },
      },
      base: {
        connect: { id: defaultBase.id },
      },
    },
  });

  console.log("✅ Admin user seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
