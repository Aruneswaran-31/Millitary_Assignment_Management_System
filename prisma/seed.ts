

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const salt = await bcrypt.genSalt(10);

  // create roles
  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: { name: 'admin' }
  });
  const bcRole = await prisma.role.upsert({
    where: { name: 'base_commander' },
    update: {},
    create: { name: 'base_commander' }
  });
  const logRole = await prisma.role.upsert({
    where: { name: 'logistics_officer' },
    update: {},
    create: { name: 'logistics_officer' }
  });

  // bases
  const baseA = await prisma.base.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: 'Alpha Base', location: 'Sector 1' }
  });
  const baseB = await prisma.base.upsert({
    where: { id: 2 },
    update: {},
    create: { id: 2, name: 'Bravo Base', location: 'Sector 2' }
  });

  // equipment
  const eq1 = await prisma.equipmentType.upsert({
    where: { code: 'VEH-LIGHT' },
    update: {},
    create: { code: 'VEH-LIGHT', name: 'Light Vehicle', unit: 'each' }
  });
  const eq2 = await prisma.equipmentType.upsert({
    where: { code: 'RIFLE-5.56' },
    update: {},
    create: { code: 'RIFLE-5.56', name: 'Rifle 5.56mm', unit: 'each' }
  });

  // admin user
  const adminUser = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: await bcrypt.hash('adminpass', salt),
      roleId: adminRole.id
    }
  });

  // create an initial purchase so balances exist
  const purchase = await prisma.purchase.create({
    data: {
      equipmentTypeId: eq1.id,
      baseId: baseA.id,
      quantity: 10,
      purchasedBy: adminUser.id,
      notes: 'Initial stock'
    }
  });

  await prisma.movement.create({
    data: {
      equipmentTypeId: eq1.id,
      baseId: baseA.id,
      movementType: 'purchase',
      relatedId: purchase.id,
      quantity: 10,
      createdBy: adminUser.id
    }
  });

  console.log('Seed complete. Admin username=admin password=adminpass');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
