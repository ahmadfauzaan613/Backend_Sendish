const express = require('express')
const router = express.Router()
const kategoriController = require('../controllers/KategoriController')
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/roleMiddleware')

router.post('/create', authenticateToken, authorizeRole(['Admin']), kategoriController.createKategoriProduk)
router.put('/update/:id', kategoriController.updateKategoriProdukController)
router.delete('/delete/:id', kategoriController.deleteKategoriProdukController)
router.get('/all-kategori', kategoriController.getAllKategoriProdukController)

module.exports = router
