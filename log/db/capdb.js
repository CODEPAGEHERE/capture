const { PrismaClient } = require('../prisma/generated/client');
const prisma = new PrismaClient();

async function connectToDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to Capdb');
  } catch (err) {
    console.error('Error connecting to Capdb:', err);
    process.exit(1);
  }
}



connectToDatabase();

module.exports = prisma;
