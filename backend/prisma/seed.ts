import { PrismaClient, AdminRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 10) throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD (10+ chars) are required.');
  await prisma.admin.upsert({
    where: { email },
    update: {},
    create: { email, passwordHash: await hash(password, 12), displayName: '최고 관리자', role: AdminRole.SUPER_ADMIN },
  });
}

main().finally(() => prisma.$disconnect());
