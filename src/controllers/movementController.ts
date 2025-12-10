// backend/src/controllers/movementController.ts

import { Request, Response } from 'express';
import { prisma } from '../db';
import { jsonBigInt } from '../utils/jsonBigInt';

// Helper: treat purchases & transfer_in as positive, others as negative
function signedQty(mType: string, q: number) {
  if (['purchase', 'transfer_in'].includes(mType)) return q;
  return -q;
}

/**
 * GET /api/movements
 * Query params: baseId, equipmentTypeId, start, end, type
 */
export async function getMovements(req: Request, res: Response) {
  try {
    const { baseId, equipmentTypeId, start, end, type } = req.query;
    const where: any = {};

    if (baseId) where.baseId = Number(baseId);
    if (equipmentTypeId) where.equipmentTypeId = Number(equipmentTypeId);
    if (type) where.movementType = String(type);
    if (start || end) {
      where.createdAt = {};
      if (start) (where.createdAt as any).gte = new Date(String(start));
      if (end) (where.createdAt as any).lte = new Date(String(end));
    }

    const movements = await prisma.movement.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    return res.json(jsonBigInt({ movements }));
  } catch (err: any) {
    console.error('getMovements error', err);
    return res.status(500).json({ error: 'Failed to fetch movements' });
  }
}

/**
 * GET /api/movements/metrics
 * Required query params: baseId, equipmentTypeId, start, end
 * Returns openingBalance, closingBalance, netMovement and breakdown
 */
export async function getDashboardMetrics(req: Request, res: Response) {
  try {
    const { baseId, equipmentTypeId, start, end } = req.query;

    if (!baseId || !equipmentTypeId || !start || !end) {
      return res.status(400).json({ error: 'baseId, equipmentTypeId, start, end are required' });
    }

    const bId = Number(baseId);
    const eId = Number(equipmentTypeId);
    const startDate = new Date(String(start));
    const endDate = new Date(String(end));

    // movements before startDate => opening
    const before = await prisma.movement.findMany({
      where: { equipmentTypeId: eId, baseId: bId, createdAt: { lt: startDate } }
    });

    const opening = before.reduce((s, m) => s + signedQty(m.movementType, m.quantity), 0);

    // movements in range
    const inRange = await prisma.movement.findMany({
      where: { equipmentTypeId: eId, baseId: bId, createdAt: { gte: startDate, lte: endDate } }
    });

    const purchases = inRange.filter(m => m.movementType === 'purchase').reduce((s, m) => s + m.quantity, 0);
    const transferIn = inRange.filter(m => m.movementType === 'transfer_in').reduce((s, m) => s + m.quantity, 0);
    const transferOut = inRange.filter(m => m.movementType === 'transfer_out').reduce((s, m) => s + m.quantity, 0);
    const assigned = inRange.filter(m => m.movementType === 'assignment').reduce((s, m) => s + m.quantity, 0);
    const expended = inRange.filter(m => m.movementType === 'expenditure').reduce((s, m) => s + m.quantity, 0);

    const netMovement = purchases + transferIn - transferOut - assigned - expended;
    const closing = opening + netMovement;

    return res.json(jsonBigInt({
      openingBalance: opening,
      closingBalance: closing,
      netMovement,
      breakdown: { purchases, transferIn, transferOut, assigned, expended }
    }));
  } catch (err: any) {
    console.error('getDashboardMetrics error', err);
    return res.status(500).json({ error: 'Failed to compute metrics' });
  }
}
