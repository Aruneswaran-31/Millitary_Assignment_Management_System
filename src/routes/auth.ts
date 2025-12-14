import { Router } from "express";
import { login } from "../controllers/authController";

const router = Router();

router.post("/login", login);

export default router;

router.post("/seed-admin", async (_req, res) => {
  try {
    const role = await prisma.role.findFirst({
      where: { name: "ADMIN" },
    });

    const base = await prisma.base.findFirst({
      where: { name: "HQ" },
    });

    if (!role || !base) {
      return res.status(500).json({
        error: "Role or Base table missing. DB not initialized properly.",
      });
    }

    const passwordHash = await bcrypt.hash("adminpass", 10);

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

    res.json({ ok: true, message: "Admin seeded successfully" });
  } catch (err) {
    console.error("SEED ERROR:", err);
    res.status(500).json({ error: "Seed failed", details: String(err) });
  }
});
