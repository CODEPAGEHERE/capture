const express = require('express');
const cors = require('cors');
const pool = require('./db/capdb');

const app = express();
app.use(cors());
app.use(express.json());

// Routes will go here





const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
