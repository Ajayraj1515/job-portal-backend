// controllers/jobController.js
const db = require('../config/db');

exports.getAllJobs = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jobs');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createJob = async (req, res) => {
  const { title, description, location } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO jobs (title, description, location) VALUES (?, ?, ?)',
      [title, description, location]
    );
    res.status(201).json({
      id: result.insertId,
      title,
      description,
      location,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
console.log('Finished executing jobController.js. Exports set.');