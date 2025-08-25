require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const routes = require('./routes');
const prisma = require('./db/capdb');
const limiter = require('./util/ratelimit');
const cookieParser = require('cookie-parser');

const app = express();



// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
  credentials: true,
}));

// Apply rate limiting to all routes
app.use(limiter);

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Request logging
app.use(morgan('combined'));







// Prisma client instance
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});





// Routes
app.use('/', routes);







// Error handling
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});












const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
