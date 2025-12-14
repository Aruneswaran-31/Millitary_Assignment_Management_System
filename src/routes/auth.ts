import { Router } from "express";
import { login } from "../controllers/authController";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", login);

export default router;
router.post("/seed-admin", async (_req, res) => {
  try {
    // 1️⃣ Ensure ROLE exists
    let role = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name: "ADMIN" },
      });
    }

    // 2️⃣ Ensure BASE exists
    let base = await prisma.base.findFirst({
      where: { name: "HQ" },
    });

    if (!base) {
      base = await prisma.base.create({
        data: {
          name: "HQ",
          location: "Headquarters",
        },
      });
    }

    // 3️⃣ Hash password
    const passwordHash = await bcrypt.hash("adminpass", 10);

    // 4️⃣ Create or update ADMIN user
    await prisma.user.upsert({
      where: { username: "admin" },
      update: {
        password: passwordHash,
      },
      create: {
        username: "admin",
        email: "admin@system.com",
        password: passwordHash,
        roleId: role.id,
        baseId: base.id,
      },
    });

    res.json({
      ok: true,
      message: "Admin seeded successfully",
    });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({
      error: "Seed failed",
      details: String(err),
    });
  }
});

