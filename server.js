// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jobRoutes = require('./routes/jobRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/jobs', jobRoutes); // updated: use full route

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
