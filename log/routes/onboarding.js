const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const bcrypt = require('bcryptjs');

router.post('/', upload.single('schoolLogo'), async (req, res) => {
  try {
    const {
      schoolName,
      schoolEmail,
      schoolPhoneNumber,
      schoolAddress,
      schoolAbout,
      schoolMotto,
      schoolColor,
      fullName,
      username,
      password,
      email,
      phoneNumber,
      address,
      roleId
    } = req.body;
    const schoolLogo = req.file;

    // Normalize inputs
    const normalizedSchoolName = schoolName.trim().toLowerCase();
    const normalizedSchoolEmail = schoolEmail.trim().toLowerCase();
    const normalizedSchoolPhoneNumber = schoolPhoneNumber.replace(/\D+/g, '');
    const normalizedPhoneNumber = phoneNumber.replace(/\D+/g, '');
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedFullName = fullName.trim().toLowerCase();

    const existingUser = await req.prisma.user.findUnique({
      where: { username: normalizedUsername },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }

    const school = await req.prisma.school.create({
      data: {
        name: normalizedSchoolName,
        email: normalizedSchoolEmail,
        contactPhone: normalizedSchoolPhoneNumber,
        address: schoolAddress,
        about: schoolAbout,
        motto: schoolMotto,
        color: schoolColor,
        logo: schoolLogo ? schoolLogo.filename : null,
      },
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await req.prisma.user.create({
      data: {
        fullName: normalizedFullName,
        username: normalizedUsername,
        password: hashedPassword,
        email: normalizedEmail,
        phoneNumber: normalizedPhoneNumber,
        address,
        schoolId: school.id,
        roleUsers: {
          create: {
            role: {
              connect: {
                id: roleId,
              },
            },
          },
        },
      },
    });

    res.json({ message: 'School and user created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating school and user' });
  }
});

router.get('/roles', async (req, res) => {
  try {
    const roles = await req.prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching roles' });
  }
});

module.exports = router;
