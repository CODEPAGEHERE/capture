const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Database connection check
pool.connect((err) => {
  if (err) {
    console.error('Error connecting to Capdb database:', err);
    process.exit(1);
  }
  console.log('Connected to Capdb database');
});

module.exports = pool;
