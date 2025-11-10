// controllers/authController.js

require('dotenv').config(); 
const User = require('../models/User'); 
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken'); 

// --- 1. ĐĂNG KÝ (SIGN UP) ---
exports.signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // B1: Kiểm tra các trường bắt buộc
        if (!email || !password || !name) {
             return res.status(400).json({ message: "Vui lòng điền đầy đủ Email, Mật khẩu và Tên." });
        }

        // B2: Kiểm tra Email Trùng lặp
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // B3: TẠO USER MỚI
        // User Model sẽ tự động HASH mật khẩu nhờ vào userSchema.pre('save').
        const newUser = new User({ 
            name, 
            email, 
            password, 
            role: 'User' // Mặc định là User
        });

        // Lưu user vào DB (hook pre('save') sẽ chạy ở đây)
        await newUser.save(); 

        // B4: Phản hồi thành công
        res.status(201).json({ 
            message: "Đăng ký tài khoản thành công!",
            user: { 
                id: newUser._id, 
                name: newUser.name, 
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error("Lỗi Đăng ký:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi Đăng ký." });
    }
};

// --- 2. ĐĂNG NHẬP (LOGIN) ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // B1: Tìm User (cần .select('+password') để lấy mật khẩu đã hash ra so sánh)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
        }

        // B2: So sánh Mật khẩu (dùng mật khẩu thô và mật khẩu đã hash từ DB)
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
        }

        // B3: Tạo JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'fallback_secret_key', // Phải dùng biến môi trường cho Secret
            { expiresIn: '1d' } // Token có giá trị trong 1 ngày
        ); 

        const userResponse = { 
            id: user._id, 
            name: user.name, 
            role: user.role 
        };
        
        
        res.status(200).json({ 
            token, 
            user: userResponse
        });
    } catch (error) {
        console.error("Lỗi Đăng nhập:", error);
        res.status(500).json({ message: "Lỗi máy chủ nội bộ khi Đăng nhập." });
    }
};

// --- 3. ĐĂNG XUẤT (LOGOUT) ---
exports.logout = (req, res) => {
    res.status(200).json({ message: "Đăng xuất thành công. Token đã bị loại bỏ phía Client." });
};