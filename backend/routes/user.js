const express = require('express');
// Import Router từ Express
const router = express.Router(); 

// Import các hàm xử lý từ Controller
const userController = require('../controllers/userController');

// Định nghĩa API Endpoint cho /users
// GET /api/users
router.get('/users', userController.getAllUsers);

// POST /api/users
router.post('/users', userController.createUser);

// Export router
module.exports = router;