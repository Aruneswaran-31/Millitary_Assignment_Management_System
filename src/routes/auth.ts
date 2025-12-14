import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

router.post("/login", login);

export default router;

import bcrypt from "bcryptjs";
import { prisma } from "../db";

router.post("/seed-admin", async (_req, res) => {
  try {
    // ensure role exists
    const role = await prisma.role.upsert({
      where: { name: "ADMIN" },
      update: {},
      create: { name: "ADMIN" },
    });

    // ensure base exists
    const base = await prisma.base.upsert({
      where: { name: "HQ" },
      update: {},
      create: { name: "HQ" },
    });

    const passwordHash = await bcrypt.hash("adminpass", 10);

    await prisma.user.upsert({
      where: { username: "admin" },
      update: {},
      create: {
        username: "admin",
        email: "admin@system.com",
        password: passwordHash,
        role: { connect: { id: role.id } },
        base: { connect: { id: base.id } },
      },
    });

    res.json({ ok: true, message: "Admin seeded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Seed failed" });
  }
});
