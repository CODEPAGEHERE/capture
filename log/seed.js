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
        { name: 'primary_student' },
        { name: 'junior_student' },
        { name: 'senior_student' },
        { name: 'parent' },
        { name: 'staff' },
        { name: 'class_teacher' },
        { name: 'subject_teacher' },
        { name: 'min_admin' },
        { name: 'main_admin' },
        { name: 'super_admin' },
      ],
    });
  }

  const terms = await prisma.term.findMany();
  if (terms.length === 0) {
    await prisma.term.createMany({
      data: [
        { name: 'first_term' },
        { name: 'second_term' },
        { name: 'third_term' },
      ],
    });
  }

  const school = await prisma.school.findFirst({ where: { name: process.env.SCHOOL_NAME } });
  let schoolId;
  if (!school) {
    const newSchool = await prisma.school.create({
      data: {
        name: process.env.SCHOOL_NAME,
        email: process.env.SCHOOL_EMAIL,
        contactPhone: process.env.SCHOOL_CONTACT_PHONE,
        address: process.env.SCHOOL_ADDRESS,
        about: process.env.SCHOOL_ABOUT,
        motto: process.env.SCHOOL_MOTTO,
        color: process.env.SCHOOL_COLOR,
        logo: process.env.SCHOOL_LOGO,
        tenantId: process.env.SCHOOL_TENANT_ID,
      },
    });
    schoolId = newSchool.id;
  } else {
    schoolId = school.id;
  }

  const superAdminRole = await prisma.role.findFirst({ where: { name: 'super_admin' } });

  const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
  const existingUser = await prisma.user.findFirst({ where: { username: process.env.ADMIN_USERNAME } });
  if (!existingUser) {
    await prisma.user.create({
      data: {
        username: process.env.ADMIN_USERNAME,
        password: hashedPassword,
        fullName: `${process.env.ADMIN_FIRST_NAME} ${process.env.ADMIN_LAST_NAME}`,
        email: process.env.ADMIN_EMAIL,
        phoneNumber: process.env.ADMIN_PHONE_NUMBER,
        schoolId: schoolId,
        roleUsers: {
          create: {
            role: { connect: { id: superAdminRole.id } },
          },
        },
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
