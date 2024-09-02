const mysql = require('mysql2')

// Buat koneksi ke database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sendish_data',
})

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack)
    return
  }
})

module.exports = db
