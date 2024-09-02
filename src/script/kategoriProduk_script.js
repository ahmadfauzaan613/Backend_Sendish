const db = require('../config/db')

const createTableKategoriProduk = `
  CREATE TABLE IF NOT EXISTS kategori_produk (
    id INT(10) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
`

db.query(createTableKategoriProduk, (err, result) => {
  if (err) throw err
  console.log('Table created successfully')
  process.exit()
})
