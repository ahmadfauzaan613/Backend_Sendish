const db = require('../config/db')

const createKategoriProduk = (name, callback) => {
  const query = `
      INSERT INTO kategori_produk (name)
      VALUES (?)
    `

  db.query(query, [name], (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

const updateKategoriProduk = (id, name, callback) => {
  const query = `
    UPDATE kategori_produk
    SET name = ?, updatedAt = NOW()
    WHERE id = ?
  `

  db.query(query, [name, id], (err, results) => {
    if (err) return callback(err)

    if (results.affectedRows === 0) {
      return callback(null, null) // Tidak ditemukan kategori dengan ID tersebut
    }

    // Ambil data kategori yang diperbarui
    const selectQuery = 'SELECT id, name FROM kategori_produk WHERE id = ?'
    db.query(selectQuery, [id], (err, results) => {
      if (err) return callback(err)
      callback(null, results[0])
    })
  })
}

const deleteKategoriProduk = (id, callback) => {
  const query = `
    DELETE FROM kategori_produk
    WHERE id = ?
  `

  db.query(query, [id], (err, results) => {
    if (err) return callback(err)

    if (results.affectedRows === 0) {
      return callback(null, null)
    }

    callback(null, results)
  })
}

const getAllKategoriProduk = (search, page, limit, sortOrder, callback) => {
  const offset = (page - 1) * limit
  const searchTerm = `%${search}%`

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM kategori_produk
    WHERE name LIKE ?
  `

  const query = `
    SELECT * 
    FROM kategori_produk
    WHERE name LIKE ?
    ORDER BY name ${sortOrder}
    LIMIT ? OFFSET ?
  `

  // Get total data count
  db.query(countQuery, [searchTerm], (err, countResults) => {
    if (err) return callback(err)

    const totalData = countResults[0].total

    // Get paginated and sorted data
    db.query(query, [searchTerm, limit, offset], (err, results) => {
      if (err) return callback(err)
      callback(null, { totalData, categories: results })
    })
  })
}

module.exports = {
  createKategoriProduk,
  updateKategoriProduk,
  deleteKategoriProduk,
  getAllKategoriProduk,
}
