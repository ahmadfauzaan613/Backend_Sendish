const db = require('../config/db')

const createTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_lengkap VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    no_handphone VARCHAR(50) NOT NULL DEFAULT '0',
    alamat TEXT NOT NULL,
    role VARCHAR(50) NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
`

db.query(createTableQuery, (err, result) => {
  if (err) throw err
  console.log('Table "transaksi" created successfully')
  process.exit()
})
