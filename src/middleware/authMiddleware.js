const jwt = require('jsonwebtoken')
const { JWT_SECRET } = process.env

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null)
    return res.status(401).json({
      message: 'Unauthorized',
      responseCode: 401,
      status: 'Unauthorized',
    })

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        message: 'Forbidden',
        responseCode: 403,
        status: 'Forbidden',
      })

    req.user = user // Add user info to request
    next()
  })
}

module.exports = authenticateToken
