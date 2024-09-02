const db = require('../config/db')

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS transaksi (
      id INT(10) AUTO_INCREMENT PRIMARY KEY,
      code_transaksi VARCHAR(50),
      nama_lengkap VARCHAR(100),
      no_handphone VARCHAR(20),
      alamat TEXT,
      metode_pembayaran VARCHAR(50),
      sistem_pembayaran VARCHAR(50),
      total_harga VARCHAR(50),
      status_pembelian VARCHAR(50),
      bukti_pembayaran LONGTEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      updatedBy VARCHAR(255)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`

db.query(createTableQuery, (err, result) => {
  if (err) throw err
  console.log('Table "transaksi" created successfully')
  process.exit()
})
