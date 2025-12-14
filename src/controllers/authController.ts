import jwt from "jsonwebtoken";

const ADMIN_USER = {
  username: "admin",
  password: "adminpass",
  role: "ADMIN",
};

export async function login(req: any, res: any) {
  const { username, password } = req.body;

  if (
    username !== ADMIN_USER.username ||
    password !== ADMIN_USER.password
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { username: ADMIN_USER.username, role: ADMIN_USER.role },
    process.env.JWT_SECRET || "dev_secret",
    { expiresIn: "1d" }
  );

  res.json({ token });
}
