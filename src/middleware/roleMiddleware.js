const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Forbidden: Insufficient permissions',
        responseCode: 403,
        status: 'Forbidden',
      })
    }
    next()
  }
}

module.exports = authorizeRole
