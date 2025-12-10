import { Request, Response } from 'express';
import { prisma } from '../db';

export async function listBases(req: Request, res: Response) {
  const bases = await prisma.base.findMany({ orderBy: { id: 'asc' }});
  res.json({ bases });
}

export async function createBase(req: Request, res: Response) {
  const { name, location } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const base = await prisma.base.create({ data: { name, location }});
  res.json({ base });
}
