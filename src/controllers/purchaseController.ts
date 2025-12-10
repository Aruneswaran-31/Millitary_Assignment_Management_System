import { Request, Response } from 'express';
import { prisma } from '../db';
import { log } from '../utils/logger';
import { serializeBigInt } from '../utils/serializeBigInt';

export async function createPurchase(req: Request, res: Response) {
  const { equipmentTypeId, baseId, quantity, unitCost, notes } = req.body;
  const user = (req as any).user;

  if (!equipmentTypeId || !baseId || !quantity) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.create({
        data: {
          equipmentTypeId,
          baseId,
          quantity,
          unitCost: unitCost ?? undefined,
          purchasedBy: user.id,
          notes: notes ?? undefined
        }
      });

      await tx.movement.create({
        data: {
          equipmentTypeId,
          baseId,
          movementType: 'purchase',
          relatedId: purchase.id,
          quantity,
          createdBy: user.id,
          notes: notes ?? undefined
        }
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'create_purchase',
          tableName: 'purchase',
          recordId: String(purchase.id),
          payload: { equipmentTypeId, baseId, quantity, unitCost, notes }
        }
      });

      return purchase;
    });

    return res.json({
      success: true,
      purchase: serializeBigInt(result)
    });

  } catch (err: any) {
    log('purchase error', err.message || err);
    return res.status(400).json({ error: err.message || 'Purchase failed' });
  }
}
