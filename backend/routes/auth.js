// routes/authRoute.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Hoạt động 1 yêu cầu 3 API

router.post('/signup', authController.signUp); 
router.post('/login', authController.login);   
router.post('/logout', authController.logout); 

module.exports = router;