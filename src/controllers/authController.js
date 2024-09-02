const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userModel = require('../models/UserModel')
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env

const loginUser = (req, res) => {
  const { username, password } = req.body

  userModel.getUserByUsername(username, (err, user) => {
    if (err) {
      console.error('Database error:', err)
      return res.status(500).json({
        message: 'Failed to authenticate',
        responseCode: 500,
        status: 'Internal Server Error',
      })
    }

    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials',
        responseCode: 401,
        status: 'Unauthorized',
      })
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err)
        return res.status(500).json({
          message: 'Failed to authenticate',
          responseCode: 500,
          status: 'Internal Server Error',
        })
      }

      if (!isMatch) {
        return res.status(401).json({
          message: 'Invalid credentials',
          responseCode: 401,
          status: 'Unauthorized',
        })
      }

      const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
      const { password, ...userData } = user

      res.status(200).json({
        message: 'Login successful',
        responseCode: 200,
        status: 'Success',
        data: {
          token,
          user: userData,
        },
      })
    })
  })
}

const logoutUser = (req, res) => {
  res.status(200).json({
    message: 'Logout successful',
    responseCode: 200,
    status: 'Success',
  })
}

module.exports = {
  loginUser,
  logoutUser,
}
