import { Request, Response } from 'express';
import { prisma } from '../db';

export async function listEquipment(req: Request, res: Response) {
  const eq = await prisma.equipmentType.findMany({ orderBy: { id: 'asc' }});
  res.json({ equipment: eq });
}

export async function createEquipment(req: Request, res: Response) {
  const { code, name, unit } = req.body;
  if (!code || !name || !unit) return res.status(400).json({ error: 'code, name and unit required' });
  const equipment = await prisma.equipmentType.create({ data: { code, name, unit }});
  res.json({ equipment });
}
