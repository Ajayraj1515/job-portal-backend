const db = require('../config/db');

exports.getJobs = (req, res) => {
  const sql = 'SELECT * FROM jobs';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.createJob = (req, res) => {
  const {
    job_title,
    company_name,
    location,
    job_type,
    salary_range,
    job_description,
    requirements,
    responsibilities,
    application_deadline
  } = req.body;

  const sql = `INSERT INTO jobs (job_title, company_name, location, job_type, salary_range, job_description, requirements, responsibilities, application_deadline)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(sql, [
    job_title,
    company_name,
    location,
    job_type,
    salary_range,
    job_description,
    requirements,
    responsibilities,
    application_deadline
  ], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Job created successfully!' });
  });
};