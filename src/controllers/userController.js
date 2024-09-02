const bcrypt = require('bcrypt')
const userModel = require('../models/UserModel')

const createUser = (req, res) => {
  const userData = req.body

  bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to hash password', code: 500, error: err })
    }

    userData.password = hashedPassword

    userModel.createUser(userData, (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({
            message: 'Duplicate data entry',
            responseCode: 409,
            status: 'Conflict',
          })
        }

        console.error('Database error:', err)
        return res.status(500).json({
          message: 'Failed to create user',
          responseCode: 500,
          status: 'Internal Server Error',
        })
      }

      res.status(200).json({
        message: 'User created successfully',
        responseCode: 200,
        status: 'Success',
        data: { id: result.insertId, ...userData, password: undefined },
      })
    })
  })
}

const getAllUsers = (req, res) => {
  const { search = '', page = 1, size = 10, sortOrder = 'asc' } = req.query
  const pageNumber = parseInt(page, 10)
  const pageSize = parseInt(size, 10)
  const sortDirection = sortOrder.toLowerCase() === 'desc' ? 'desc' : 'asc'

  if (isNaN(pageNumber) || pageNumber < 1) {
    return res.status(400).json({
      message: 'Invalid page number',
      responseCode: 400,
      status: 'Bad Request',
    })
  }

  if (isNaN(pageSize) || pageSize < 1) {
    return res.status(400).json({
      message: 'Invalid page size',
      responseCode: 400,
      status: 'Bad Request',
    })
  }

  userModel.getAllUsers(search, pageNumber, pageSize, sortDirection, (err, result) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({
        message: 'Failed to get users',
        responseCode: 500,
        status: 'Internal Server Error',
      })
    }

    const { totalData, users } = result

    res.status(200).json({
      message: 'Users retrieved successfully',
      responseCode: 200,
      status: 'Success',
      data: {
        data: users,
        pagination: {
          totalData,
          page: pageNumber,
          size: pageSize,
        },
      },
    })
  })
}

const deleteUserById = (req, res) => {
  const userId = req.params.id

  userModel.deleteUserById(userId, (err, result) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({
        message: 'Failed to delete user',
        responseCode: 500,
        status: 'Internal Server Error',
        error: err,
      })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'User not found',
        responseCode: 404,
        status: 'Not Found',
      })
    }

    res.status(200).json({
      message: 'User deleted successfully',
      responseCode: 200,
      status: 'Success',
    })
  })
}

const updateUserById = (req, res) => {
  const userId = req.params.id
  const userData = req.body

  if (userData.password) {
    bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({
          message: 'Failed to hash password',
          responseCode: 500,
          status: 'Internal Server Error',
          error: err,
        })
      }

      userData.password = hashedPassword

      userModel.updateUserById(userId, userData, (err, updatedUser) => {
        if (err) {
          console.error('Database error:', err)

          // Penanganan kesalahan duplikasi username
          if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
              message: 'Duplicate Username',
              responseCode: 400,
              status: 'Bad Request',
            })
          }

          // Penanganan kesalahan lain
          return res.status(500).json({
            message: 'Failed to update user',
            responseCode: 500,
            status: 'Internal Server Error',
          })
        }

        if (!updatedUser) {
          return res.status(404).json({
            message: 'User not found or no data updated',
            responseCode: 404,
            status: 'Not Found',
          })
        }

        res.status(200).json({
          message: 'User updated successfully',
          responseCode: 200,
          status: 'Success',
          data: updatedUser,
        })
      })
    })
  } else {
    // Jika tidak ada password, langsung update data
    userModel.updateUserById(userId, userData, (err, updatedUser) => {
      if (err) {
        console.error('Database error:', err)

        // Penanganan kesalahan duplikasi username
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({
            message: 'Duplicate Username',
            responseCode: 400,
            status: 'Bad Request',
          })
        }

        // Penanganan kesalahan lain
        return res.status(500).json({
          message: 'Failed to update user',
          responseCode: 500,
          status: 'Internal Server Error',
        })
      }

      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found or no data updated',
          responseCode: 404,
          status: 'Not Found',
        })
      }

      res.status(200).json({
        message: 'User updated successfully',
        responseCode: 200,
        status: 'Success',
        data: updatedUser,
      })
    })
  }
}

const getUserById = (req, res) => {
  const userId = req.params.id

  userModel.getUserById(userId, (err, user) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({
        message: 'Failed to get user',
        responseCode: 500,
        status: 'Internal Server Error',
      })
    }

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
        responseCode: 404,
        status: 'Not Found',
      })
    }

    res.status(200).json({
      message: 'User retrieved successfully',
      responseCode: 200,
      status: 'Success',
      data: user,
    })
  })
}

module.exports = {
  createUser,
  getAllUsers,
  deleteUserById,
  getUserById,
  updateUserById,
}
