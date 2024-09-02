const express = require('express')
const router = express.Router()
const produkController = require('../controllers/produkController')
const multer = require('multer')
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/roleMiddleware')

// Konfigurasi Multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/create', authenticateToken, authorizeRole(['Admin']), upload.single('gambar'), produkController.createProduct)
router.put('/:id', authenticateToken, authorizeRole(['Admin']), upload.single('gambar'), produkController.updateProduct)
router.get('/', produkController.getAllProducts)
router.get('/:id', produkController.getProductById)
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), produkController.deleteProduct)
module.exports = router
