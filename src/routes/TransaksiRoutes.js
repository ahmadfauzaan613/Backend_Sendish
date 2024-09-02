const express = require('express')
const router = express.Router()
const transaksiController = require('../controllers/TransaksiController')
const multer = require('multer')
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/roleMiddleware')
// Konfigurasi Multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/create', upload.single('buktiPembayaran'), transaksiController.createTransaksiController)
router.put('/update/:id', authenticateToken, authorizeRole(['Admin']), transaksiController.updateStatusTransaksiController)
router.delete('/delete/:id', authenticateToken, authorizeRole(['Admin']), transaksiController.deleteTransaksi)
router.get('/detail/:id', authenticateToken, authorizeRole(['Admin']), transaksiController.getTransaksiById)
router.post('/search', transaksiController.getTransaksiByCode)
router.get('/transaksi-all', authenticateToken, authorizeRole(['Admin']), transaksiController.getTransaksiController)

module.exports = router
