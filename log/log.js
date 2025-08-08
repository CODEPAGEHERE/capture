require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const pool = require('./db/capdb');
const routes = require('./routes');

const app = express();





// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS,
}));

// Request logging
app.use(morgan('combined'));

// Request parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Routes
app.use('/api', routes);







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
