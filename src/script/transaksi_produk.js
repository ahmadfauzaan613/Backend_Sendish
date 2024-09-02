const db = require('../config/db')

const createTableQuery = `
CREATE TABLE IF NOT EXISTS transaksi_produk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_transaksi INT NOT NULL,
    id_produk INT NOT NULL,
    FOREIGN KEY (id_transaksi) REFERENCES transaksi(id) ON DELETE CASCADE,
    FOREIGN KEY (id_produk) REFERENCES produk(id) ON DELETE CASCADE
);
`

db.query(createTableQuery, (err, result) => {
  if (err) throw err
  console.log('Table "transaksi" created successfully')
  process.exit()
})
