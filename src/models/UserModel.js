const db = require('../config/db')
const moment = require('moment-timezone')
const bcrypt = require('bcrypt')

const createUser = (userData, callback) => {
  const query = `
      INSERT INTO users (nama_lengkap, username, password, no_handphone, alamat, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `
  const { nama_lengkap, username, password, no_handphone, alamat, role } = userData

  db.query(query, [nama_lengkap, username, password, no_handphone, alamat, role], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const getAllUsers = (search, page, limit, sortOrder, callback) => {
  const offset = (page - 1) * limit
  const searchTerm = `%${search}%`

  const countQuery = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE role = 'User'
      AND (nama_lengkap LIKE ? OR username LIKE ?)
  `

  const query = `
      SELECT id, nama_lengkap, username, no_handphone, alamat, role, createdAt, updatedAt
      FROM users
      WHERE role = 'User'
      AND (nama_lengkap LIKE ? OR username LIKE ?)
      ORDER BY id ${sortOrder}
      LIMIT ? OFFSET ?
  `

  db.query(countQuery, [searchTerm, searchTerm], (err, countResults) => {
    if (err) return callback(err)

    const totalData = countResults[0].total

    db.query(query, [searchTerm, searchTerm, limit, offset], (err, results) => {
      if (err) return callback(err)
      callback(null, { totalData, users: results })
    })
  })
}

const getUserById = (userId, callback) => {
  const query = `
    SELECT id, nama_lengkap, username, no_handphone, alamat, role, createdAt, updatedAt
    FROM users
    WHERE id = ?
  `
  db.query(query, [userId], (err, results) => {
    if (err) return callback(err)
    const user = results[0]
    if (user) {
      user.createdAt = moment(user.createdAt).tz('Asia/Jakarta').format()
      user.updatedAt = moment(user.updatedAt).tz('Asia/Jakarta').format()
    }

    callback(null, user)
  })
}

const updateUserById = (userId, userData, callback) => {
  let query = 'UPDATE users SET '
  const params = []

  if (userData.nama_lengkap) {
    query += 'nama_lengkap = ?, '
    params.push(userData.nama_lengkap)
  }
  if (userData.username) {
    query += 'username = ?, '
    params.push(userData.username)
  }
  if (userData.password) {
    query += 'password = ?, '
    params.push(userData.password)
  }
  if (userData.no_handphone) {
    query += 'no_handphone = ?, '
    params.push(userData.no_handphone)
  }
  if (userData.alamat) {
    query += 'alamat = ?, '
    params.push(userData.alamat)
  }
  if (userData.role) {
    query += 'role = ?, '
    params.push(userData.role)
  }

  query = query.slice(0, -2)
  query += ' WHERE id = ?'
  params.push(userId)

  db.query(query, params, (err, result) => {
    if (err) return callback(err)

    if (result.affectedRows === 0) {
      return callback(null, null)
    }

    getUserById(userId, (err, updatedUser) => {
      if (err) return callback(err)
      callback(null, updatedUser)
    })
  })
}

const deleteUserById = (id, callback) => {
  const query = `
      DELETE FROM users WHERE id = ?
    `

  db.query(query, [id], (err, result) => {
    if (err) return callback(err)
    callback(null, result)
  })
}

const getUserByUsername = (username, callback) => {
  const query = `
    SELECT id, username, password, role
    FROM users
    WHERE username = ?
  `
  db.query(query, [username], (err, results) => {
    if (err) return callback(err)
    const user = results[0]
    callback(null, user)
  })
}

// LOGIN

module.exports = {
  createUser,
  getAllUsers,
  updateUserById,
  getUserById,
  getUserByUsername,
  deleteUserById,
}
