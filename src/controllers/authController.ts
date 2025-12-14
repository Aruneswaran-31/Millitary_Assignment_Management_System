import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Hardcoded admin (NO DB)
const ADMIN_USER = {
  username: "admin",
  passwordHash: bcrypt.hashSync("adminpass", 10),
  role: "ADMIN",
};

export async function login(req: Request, res: Response) {
  const { username, password } = req.body as {
    username?: string;
    password?: string;
  };

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (username !== ADMIN_USER.username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, ADMIN_USER.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: ADMIN_USER.username, role: ADMIN_USER.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1d" }
  );

  return res.json({ token });
}
