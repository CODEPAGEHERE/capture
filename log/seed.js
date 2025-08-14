const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

async function main() {
  const roles = await prisma.role.findMany();
  if (roles.length === 0) {
    await prisma.role.createMany({
      data: [
        { name: 'ADMIN' },
        { name: 'STAFF' },
        { name: 'TEACHER' },
        { name: 'STUDENT' },
      ],
    });
  }

  const roleTypes = await prisma.roleType.findMany();
  if (roleTypes.length === 0) {
    await prisma.roleType.createMany({
      data: [
        { name: 'SUPERADMIN' },
        { name: 'SUBADMIN' },
        { name: 'CLASS_TEACHER' },
        { name: 'SUBJECT_TEACHER' },
      ],
    });
  }

  const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
  const superAdminRoleType = await prisma.roleType.findFirst({ where: { name: 'SUPERADMIN' } });

  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  const existingUser = await prisma.user.findFirst({ where: { username: process.env.ADMIN_USERNAME } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        firstName: process.env.ADMIN_FIRST_NAME,
        lastName: process.env.ADMIN_LAST_NAME,
        email: process.env.ADMIN_EMAIL,
        phoneNumber: process.env.ADMIN_PHONE_NUMBER,
        role: { connect: { id: adminRole.id } },
        roleType: { connect: { id: superAdminRoleType.id } },
      },
    });
  }

  const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
  const existingDefaultUser = await prisma.user.findFirst({ where: { username: 'defaultuser' } });
  if (!existingDefaultUser) {
    const defaultUserPassword = await hashPassword('password');
    await prisma.user.create({
      data: {
        username: 'defaultuser',
        password: defaultUserPassword,
        firstName: 'Default',
        lastName: 'User',
        email: 'default@example.com',
        role: { connect: { id: studentRole.id } },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
