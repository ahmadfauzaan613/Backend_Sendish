const db = require('../config/db')

const generateCodeTransaksi = () => {
  const prefix = 'SD'
  const randomNumber = Math.floor(1000 + Math.random() * 9000) // Menghasilkan angka acak 4 digit
  return `${prefix}${randomNumber}`
}

const createTransaksi = (transaksiData, callback) => {
  const { code_transaksi, nama_lengkap, no_handphone, alamat, metode_pembayaran, sistem_pembayaran, total_harga, status_pembelian, bukti_pembayaran, dataProduk } = transaksiData

  // Query untuk insert transaksi
  const insertTransaksiQuery = `
        INSERT INTO transaksi (
            code_transaksi,
            nama_lengkap,
            no_handphone,
            alamat,
            metode_pembayaran,
            sistem_pembayaran,
            total_harga,
            status_pembelian,
            bukti_pembayaran
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

  // Menyimpan transaksi
  db.query(insertTransaksiQuery, [code_transaksi, nama_lengkap, no_handphone, alamat, metode_pembayaran, sistem_pembayaran, total_harga, status_pembelian, bukti_pembayaran], (err, result) => {
    if (err) return callback(err)

    const transaksiId = result.insertId

    // Menyimpan produk terkait ke tabel transaksi_produk
    const insertTransaksiProdukQuery = `
            INSERT INTO transaksi_produk (id_transaksi, id_produk)
            VALUES ?
        `

    const transaksiProdukData = dataProduk.map((produk) => [transaksiId, produk.id])

    db.query(insertTransaksiProdukQuery, [transaksiProdukData], (err) => {
      if (err) return callback(err)

      callback(null, {
        id: transaksiId,
        code_transaksi,
        nama_lengkap,
        no_handphone,
        alamat,
        metode_pembayaran,
        sistem_pembayaran,
        total_harga,
        status_pembelian,
        dataProduk,
      })
    })
  })
}
const updateStatusTransaksi = (id, statusPembelian, updatedBy, callback) => {
  db.beginTransaction((err) => {
    if (err) return callback(err)

    const updateQuery = `
      UPDATE transaksi
      SET status_pembelian = ?, updated_at = NOW(), updatedBy = ?
      WHERE id = ?
    `
    db.query(updateQuery, [statusPembelian, updatedBy, id], (err, results) => {
      if (err) {
        return db.rollback(() => callback(err))
      }

      const selectQuery = 'SELECT code_transaksi, status_pembelian, updatedBy FROM transaksi WHERE id = ?'
      db.query(selectQuery, [id], (err, results) => {
        if (err) {
          return db.rollback(() => callback(err))
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => callback(err))
          }
          callback(null, results[0])
        })
      })
    })
  })
}
const deleteTransaksiById = (id, callback) => {
  const query = 'DELETE FROM transaksi WHERE id = ?'
  db.query(query, [id], (err, results) => {
    if (err) return callback(err)
    callback(null, results)
  })
}

const getTransaksiByIdFromModel = (transactionId, callback) => {
  const query = `
  SELECT t.id AS transaction_id, t.code_transaksi, t.nama_lengkap, t.no_handphone, t.alamat, 
         t.metode_pembayaran, t.sistem_pembayaran, t.total_harga, t.status_pembelian,t.bukti_pembayaran, 
         p.id, p.nama_produk, p.deskripsi_produk, p.harga_lama, p.harga_baru, p.kategoriProduk
  FROM transaksi t
  JOIN transaksi_produk tp ON t.id = tp.id_transaksi
  JOIN produk p ON tp.id_produk = p.id
  WHERE t.id = ?`

  db.query(query, [transactionId], (err, results) => {
    if (err) return callback(err)

    // Mengorganisir data
    const transaction = {
      id: results[0].transaction_id,
      code_transaksi: results[0].code_transaksi,
      nama_lengkap: results[0].nama_lengkap,
      no_handphone: results[0].no_handphone,
      alamat: results[0].alamat,
      metode_pembayaran: results[0].metode_pembayaran,
      sistem_pembayaran: results[0].sistem_pembayaran,
      total_harga: results[0].total_harga,
      status_pembelian: results[0].status_pembelian,
      bukti_pembayaran: results[0].bukti_pembayaran,
      dataProduk: results.map((row) => ({
        id_produk: row.id_produk,
        nama_produk: row.nama_produk,
        deskripsi_produk: row.deskripsi_produk,
        harga_lama: row.harga_lama,
        harga_baru: row.harga_baru,
        kategoriProduk: row.kategoriProduk,
      })),
    }

    callback(null, transaction)
  })
}

const getTransaksiByCodeFromModel = (code_transaksi, callback) => {
  const query = `
  SELECT t.id AS transaction_id, t.code_transaksi, t.nama_lengkap, t.no_handphone, t.alamat, 
         t.metode_pembayaran, t.sistem_pembayaran, t.total_harga, t.status_pembelian,t.bukti_pembayaran, 
         p.id, p.nama_produk, p.deskripsi_produk, p.harga_lama, p.harga_baru, p.kategoriProduk
  FROM transaksi t
  JOIN transaksi_produk tp ON t.id = tp.id_transaksi
  JOIN produk p ON tp.id_produk = p.id
  WHERE t.code_transaksi = ?`

  db.query(query, [code_transaksi], (err, results) => {
    if (err) return callback(err)

    if (results.length === 0) {
      return callback(null, null)
    }

    // Mengorganisir data
    const transaction = {
      id: results[0].transaction_id,
      code_transaksi: results[0].code_transaksi,
      nama_lengkap: results[0].nama_lengkap,
      no_handphone: results[0].no_handphone,
      alamat: results[0].alamat,
      metode_pembayaran: results[0].metode_pembayaran,
      sistem_pembayaran: results[0].sistem_pembayaran,
      total_harga: results[0].total_harga,
      status_pembelian: results[0].status_pembelian,
      bukti_pembayaran: results[0].bukti_pembayaran,
      dataProduk: results.map((row) => ({
        id_produk: row.id_produk,
        nama_produk: row.nama_produk,
        deskripsi_produk: row.deskripsi_produk,
        harga_lama: row.harga_lama,
        harga_baru: row.harga_baru,
        kategoriProduk: row.kategoriProduk,
      })),
    }

    callback(null, transaction)
  })
}

const getAllTransaksiModel = (filters, page, limit, sortOrder, callback) => {
  const offset = (page - 1) * limit
  const { code_transaksi, nama_lengkap, metode_pembayaran, sistem_pembayaran, status_pembelian } = filters

  const searchParams = []
  const searchConditions = []

  if (code_transaksi) {
    searchConditions.push('t.code_transaksi LIKE ?')
    searchParams.push(`%${code_transaksi}%`)
  }
  if (nama_lengkap) {
    searchConditions.push('t.nama_lengkap LIKE ?')
    searchParams.push(`%${nama_lengkap}%`)
  }
  if (metode_pembayaran) {
    searchConditions.push('t.metode_pembayaran LIKE ?')
    searchParams.push(`%${metode_pembayaran}%`)
  }
  if (sistem_pembayaran) {
    searchConditions.push('t.sistem_pembayaran LIKE ?')
    searchParams.push(`%${sistem_pembayaran}%`)
  }
  if (status_pembelian) {
    searchConditions.push('t.status_pembelian LIKE ?')
    searchParams.push(`%${status_pembelian}%`)
  }

  const whereClause = searchConditions.length > 0 ? `WHERE ${searchConditions.join(' AND ')}` : ''

  // Query untuk mendapatkan total data
  const countQuery = `
    SELECT COUNT(*) AS total
    FROM transaksi t
    ${whereClause}
  `

  // Query untuk mendapatkan data dengan pagination
  const query = `
    SELECT t.id AS transaction_id, t.code_transaksi, t.nama_lengkap, t.no_handphone, t.alamat, 
           t.metode_pembayaran, t.sistem_pembayaran, t.total_harga, t.status_pembelian, t.bukti_pembayaran
    FROM transaksi t
    ${whereClause}
    ORDER BY t.code_transaksi ${sortOrder}
    LIMIT ? OFFSET ?
  `

  // Get total data count
  db.query(countQuery, searchParams, (err, countResults) => {
    if (err) return callback(err)

    const totalData = countResults[0].total

    // Get paginated data
    db.query(query, [...searchParams, limit, offset], (err, results) => {
      if (err) return callback(err)
      callback(null, { totalData, transaksi: results })
    })
  })
}

module.exports = {
  createTransaksi,
  generateCodeTransaksi,
  updateStatusTransaksi,
  deleteTransaksiById,
  getTransaksiByIdFromModel,
  getTransaksiByCodeFromModel,
  getAllTransaksiModel,
}
