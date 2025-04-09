
const express = require('express');
const cors = require('cors');
const jobRoutes = require('./routes/jobRoutes'); // adjust the path if needed

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', jobRoutes);

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
