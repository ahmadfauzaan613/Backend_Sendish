const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const authenticateToken = require('../middleware/authMiddleware')
const authorizeRole = require('../middleware/roleMiddleware')

router.post('/create', authenticateToken, userController.createUser)
router.put('/:id', authenticateToken, userController.updateUserById)

router.get('/', userController.getAllUsers)
router.delete('/:id', authenticateToken, authorizeRole(['Admin']), userController.deleteUserById)
router.get('/:id', authenticateToken, userController.getUserById)

module.exports = router
