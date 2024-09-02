require('dotenv').config()
const session = require('express-session')
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.APP_PORT

const bodyParser = require('body-parser')
const userRoutes = require('./routes/userRoutes')
const produkRoutes = require('./routes/produkRoutes')
const transaksiRoutes = require('./routes/TransaksiRoutes')
const kategoriRoutes = require('./routes/kategoriRoute')
const authRoutes = require('./routes/authRoutes')

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json())

// LOGIN
app.use('/api/auth', authRoutes)

// USER
app.use('/api/users', userRoutes)
app.use('/api/produk', produkRoutes)
app.use('/api/transaksi', transaksiRoutes)
app.use('/api/ketegori', kategoriRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: 'Something went wrong!',
    responseCode: 500,
    status: 'error',
  })
})

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
