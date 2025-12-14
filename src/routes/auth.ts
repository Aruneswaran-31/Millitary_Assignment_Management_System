import { Router } from "express";
import { login } from "../controllers/authController";
import { prisma } from "../db";
import bcrypt from "bcryptjs";

const router = Router();

// LOGIN
router.post("/login", login);

// SEED ADMIN
router.post("/seed-admin", async (_req, res) => {
  try {
    // ROLE
    let role = await prisma.role.findUnique({
      where: { name: "ADMIN" },
    });

    if (!role) {
      role = await prisma.role.create({
        data: { name: "ADMIN" },
      });
    }

    // BASE
    let base = await prisma.base.findFirst({
      where: { name: "HQ" },
    });


    if (!base) {
      base = await prisma.base.create({
        data: { name: "HQ" },
      });
    }

    // PASSWORD
    const passwordHash = await bcrypt.hash("adminpass", 10);

    // USER
    await prisma.user.upsert({
      where: { username: "admin" },
      update: {
        password: passwordHash,
        roleId: role.id,
        baseId: base.id,
      },
      create: {
        username: "admin",
        email: "admin@system.com",
        password: passwordHash,
        roleId: role.id,
        baseId: base.id,
      },
    });

    res.json({ ok: true, message: "Admin seeded successfully" });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: "Seed failed", details: String(err) });
  }
});

export default router;
