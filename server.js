// Import required modules
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Load environment variables (optional, good for deployment)
// require('dotenv').config(); // Run 'npm install dotenv' if you use this

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 5000; // Use port from environment or default to 5000

// --- Database Connection ---
// Use environment variables for sensitive data like DB credentials
const dbConfig = {
  host: process.env.DB_HOST || 'localhost', // Replace 'localhost' if your DB is hosted elsewhere
  user: process.env.DB_USER || 'root',     // Replace 'root' with your DB username
  password: process.env.DB_PASSWORD || '', // Replace '' with your DB password
  database: process.env.DB_NAME || 'job_board', // Replace 'job_board' with your DB name
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Test the connection (optional, helps with debugging)
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    // You might want to exit the process if the DB connection fails on startup
    // process.exit(1);
    return;
  }
  console.log('Successfully connected to the MySQL database.');
  if (connection) connection.release(); // Release the connection back to the pool
});

// --- Middleware ---
app.use(cors()); // Enable Cross-Origin Resource Sharing for your React frontend
app.use(express.json()); // Parse incoming requests with JSON payloads
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// --- Database Schema (Run this SQL query in your MySQL client once) ---
/*
CREATE DATABASE IF NOT EXISTS job_board;

USE job_board;

CREATE TABLE IF NOT EXISTS jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  jobTitle VARCHAR(255) NOT NULL,
  companyName VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  jobType ENUM('Full-time', 'Part-time', 'Contract', 'Internship'),
  salaryRange VARCHAR(100),
  jobDescription TEXT,
  requirements TEXT,
  responsibilities TEXT,
  applicationDeadline DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/

// --- API Routes ---

// GET /jobs - Retrieve all job postings
app.get('/jobs', (req, res) => {
  const sql = "SELECT * FROM jobs ORDER BY createdAt DESC"; // Get newest jobs first

  pool.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching jobs:', err);
      return res.status(500).json({ message: 'Error fetching job data', error: err.message });
    }
    res.status(200).json(results);
  });
});

// POST /jobs - Create a new job posting
app.post('/jobs', (req, res) => {
  // Extract job data from request body (ensure your frontend sends these fields)
  const {
    jobTitle,
    companyName,
    location,
    jobType,
    salaryRange,
    jobDescription,
    requirements,
    responsibilities,
    applicationDeadline // Make sure the date is in 'YYYY-MM-DD' format
  } = req.body;

  // Basic validation (you should add more robust validation)
  if (!jobTitle || !companyName) {
    return res.status(400).json({ message: 'Job Title and Company Name are required.' });
  }

  const sql = `INSERT INTO jobs (jobTitle, companyName, location, jobType, salaryRange, jobDescription, requirements, responsibilities, applicationDeadline)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    jobTitle,
    companyName,
    location,
    jobType,
    salaryRange,
    jobDescription,
    requirements,
    responsibilities,
    applicationDeadline // Ensure this is null or a valid date string 'YYYY-MM-DD'
  ];

  pool.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error creating job:', err);
      return res.status(500).json({ message: 'Error creating job posting', error: err.message });
    }
    // Send back the ID of the newly created job
    res.status(201).json({ message: 'Job created successfully', jobId: results.insertId });
  });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Basic error handling for uncaught exceptions (optional)
process.on('uncaughtException', (err) => {
  console.error('There was an uncaught error', err);
  // Optionally attempt graceful shutdown or just exit
  // process.exit(1);
});