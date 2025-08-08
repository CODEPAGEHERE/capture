const { PrismaClient } = require('./prisma/generated/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.role.createMany({
    data: [
      { name: 'ADMIN' },
      { name: 'STAFF' },
      { name: 'TEACHER' },
      { name: 'STUDENT' },
    ],
  });

  await prisma.roleType.createMany({
    data: [
      { name: 'SUPERADMIN' },
      { name: 'SUBADMIN' },
      { name: 'CLASS_TEACHER' },
      { name: 'SUBJECT_TEACHER' },
    ],
  });

  const adminRole = await prisma.role.findFirst({ where: { name: 'ADMIN' } });
  const superAdminRoleType = await prisma.roleType.findFirst({ where: { name: 'SUPERADMIN' } });

  await prisma.user.create({
    data: {
      username: 'admin',
      password: 'password', // Make sure to hash this password in a real application
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      role: { connect: { id: adminRole.id } },
      roleType: { connect: { id: superAdminRoleType.id } },
    },
  });

  const studentRole = await prisma.role.findFirst({ where: { name: 'STUDENT' } });
  await prisma.user.create({
    data: {
      username: 'defaultuser',
      password: 'password', // Make sure to hash this password in a real application
      firstName: 'Default',
      lastName: 'User',
      email: 'default@example.com',
      role: { connect: { id: studentRole.id } },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
