import { Request, Response } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
export async function listUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    select: { id: true, username: true, email: true, roleId: true, baseId: true },
    orderBy: { username: 'asc' }
  });
  res.json({ users });
}

export async function createUser(req: Request, res: Response) {
  const { username, email, password, roleName, baseId } = req.body;
  if (!username || !password || !roleName) return res.status(400).json({ error: 'username, password, roleName required' });

  // find role
  const role = await prisma.role.findUnique({ where: { name: roleName }});
  if (!role) return res.status(400).json({ error: 'Invalid roleName' });

  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      username,
      email: email ?? null,
      password: hashed,
      roleId: role.id,
      baseId: baseId ?? null
    }
  });

  // Do not return password
  res.json({ user: { id: user.id, username: user.username, email: user.email, roleId: user.roleId, baseId: user.baseId }});
}
