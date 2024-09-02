const db = require('../config/db')

const createTableProduk = `
  CREATE TABLE IF NOT EXISTS produk (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    nama_produk VARCHAR(255) NOT NULL,
    deskripsi_produk TEXT,
    gambar LONGTEXT,
    statusDiskon TINYINT(1) DEFAULT 0,
    harga_lama VARCHAR(255),
    harga_baru VARCHAR(255),
    diskon VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    createdBy VARCHAR(255),
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updatedBy VARCHAR(255),
    codeProduct VARCHAR(255),
    kategoriProduk VARCHAR(255)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`

db.query(createTableProduk, (err, result) => {
  if (err) throw err
  console.log('Table "produk" created successfully')
  process.exit()
})
