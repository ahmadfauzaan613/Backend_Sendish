const db = require('../config/db')

const getLatestProductCode = (callback) => {
  const query = `SELECT codeProduct FROM produk ORDER BY id DESC LIMIT 1`
  db.query(query, (err, results) => {
    if (err) {
      return callback(err)
    }
    const latestCode = results.length ? results[0].codeProduct : 'P0000'
    callback(null, latestCode)
  })
}

const createProduct = (data, callback) => {
  getLatestProductCode((err, latestCode) => {
    if (err) {
      return callback(err)
    }

    const nextCodeNumber = parseInt(latestCode.substring(1)) + 1
    const codeProduct = `P${nextCodeNumber.toString().padStart(4, '0')}`

    const query = `
        INSERT INTO produk (nama_produk, deskripsi_produk, gambar, statusDiskon, harga_lama, harga_baru, diskon, createdBy, codeProduct, kategoriProduk)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `

    db.query(query, [data.nama_produk, data.deskripsi_produk, data.gambar, data.statusDiskon, data.harga_lama, data.harga_baru, data.diskon, data.createdBy, codeProduct, data.kategoriProduk], (err, results) => {
      if (err) {
        return callback(err)
      }
      callback(null, { id: results.insertId, codeProduct, ...data })
    })
  })
}

const updateProduct = (id, data, callback) => {
  const updates = []
  const values = []

  const columns = ['nama_produk', 'deskripsi_produk', 'gambar', 'statusDiskon', 'harga_lama', 'harga_baru', 'diskon', 'kategoriProduk', 'updatedBy']

  columns.forEach((column) => {
    if (data[column] !== undefined && data[column] !== null) {
      updates.push(`${column} = ?`)
      values.push(data[column])
    }
  })

  if (updates.length === 0) {
    return callback(new Error('No data to update'))
  }

  const query = `
    UPDATE produk
    SET ${updates.join(', ')}, updatedAt = NOW()
    WHERE id = ?
  `
  values.push(id)

  db.query(query, values, (err, results) => {
    if (err) {
      return callback(err)
    }
    callback(null, { id, ...data })
  })
}

const getAllProducts = (search, category, page, size, sort, sortOrder, callback) => {
  const offset = (page - 1) * size
  const searchTerm = `%${search}%`
  const categoryTerm = `%${category}%`

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM produk
    WHERE (nama_produk LIKE ? OR deskripsi_produk LIKE ?) AND kategoriProduk LIKE ?
  `

  const query = `
    SELECT * FROM produk
    WHERE (nama_produk LIKE ? OR deskripsi_produk LIKE ?) AND kategoriProduk LIKE ?
    ORDER BY ${sort} ${sortOrder}
    LIMIT ? OFFSET ?
  `

  // Get total data count
  db.query(countQuery, [searchTerm, searchTerm, categoryTerm], (err, countResults) => {
    if (err) return callback(err)

    const totalData = countResults[0].total

    // Get paginated and sorted data
    db.query(query, [searchTerm, searchTerm, categoryTerm, size, offset], (err, results) => {
      if (err) return callback(err)
      callback(null, { totalData, products: results })
    })
  })
}

const getProductById = (productId, callback) => {
  const query = 'SELECT * FROM produk WHERE id = ?'

  db.query(query, [productId], (err, results) => {
    if (err) return callback(err)
    if (results.length === 0) return callback(new Error('Product not found'))
    callback(null, results[0])
  })
}

const deleteProduct = (productId, callback) => {
  const query = 'DELETE FROM produk WHERE id = ?'

  db.query(query, [productId], (err, results) => {
    if (err) return callback(err)
    if (results.affectedRows === 0) return callback(new Error('Product not found'))
    callback(null, { message: 'Product deleted successfully' })
  })
}

module.exports = {
  createProduct,
  updateProduct,
  getAllProducts,
  deleteProduct,
  getProductById,
}
