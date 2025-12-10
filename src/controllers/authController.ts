import { Request, Response } from "express";
import { prisma } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXP = "8h";

export async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: "Missing credentials" });

  const user = await prisma.user.findUnique({ where: { username }, include: { role: true } });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role.name, baseId: user.baseId },
    JWT_SECRET,
    { expiresIn: JWT_EXP }
  );

  res.json({ token });
}
