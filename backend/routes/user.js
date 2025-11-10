const express = require('express');
const router = express.Router();

// Import Controller Profile
const profileController = require('../controllers/profileController'); 
// Import Controller User (CRUD Admin)
const userController = require('../controllers/userController'); 
// Import Middleware xác thực
const authMiddleware = require('../middleware/authMiddleware');

// --- 1. TUYẾN ĐƯỜNG DÀNH CHO NGƯỜI DÙNG HIỆN TẠI (PROFILE) ---
// Đường dẫn: GET/PUT /api/users/profile
// Cần áp dụng authMiddleware để có req.user
router.get('/profile', authMiddleware, profileController.getProfile); 
router.put('/profile', authMiddleware, profileController.updateProfile); 

// --- 2. TUYẾN ĐƯỜNG CRUD DÀNH CHO ADMIN (NẾU CÓ) ---
// Cần thêm authMiddleware và middleware kiểm tra vai trò ('Admin') nếu có
router.get('/', userController.getUsers); 
router.post('/', userController.createUser); 
router.put('/:id', userController.updateUser); 
router.delete('/:id', userController.deleteUser); 

module.exports = router;