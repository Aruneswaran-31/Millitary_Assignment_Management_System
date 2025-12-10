import { Request, Response } from "express";
import { prisma } from "../db";
import { fixBigInt } from '../utils/bigIntFix';

export async function createTransfer(req: Request, res: Response) {
  const { equipmentTypeId, fromBaseId, toBaseId, quantity } = req.body;
  const user = (req as any).user;

  const transfer = await prisma.transfer.create({
    data: {
      equipmentTypeId,
      fromBaseId,
      toBaseId,
      quantity,
      initiatedBy: user.id
    }
  });

  await prisma.movement.create({
    data: {
      equipmentTypeId,
      baseId: fromBaseId,
      quantity,
      movementType: "transfer_out",
      createdBy: user.id
    }
  });

  await prisma.movement.create({
    data: {
      equipmentTypeId,
      baseId: toBaseId,
      quantity,
      movementType: "transfer_in",
      createdBy: user.id
    }
  });

  res.json({ success: true, transfer: fixBigInt(transfer) });

}
