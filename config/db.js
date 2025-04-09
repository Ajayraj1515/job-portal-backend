// config/db.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username',       // ✅ Use your local MySQL username
  password: 'Ajayraj@1515',    // ✅ Your MySQL password
  database: 'job_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
