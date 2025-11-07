// controllers/authController.js

require('dotenv').config(); // Đảm bảo load biến môi trường
const User = require('../models/User'); // Model từ SV3
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // B1: Kiểm tra Email Trùng lặp
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email đã tồn tại." });
        }

        // B2: Mã hóa Mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10); 

        // B3: Tạo và lưu User mới
        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role: 'User' // Vai trò mặc định
        });
        await newUser.save();

        res.status(201).json({ message: "Đăng ký thành công" });
    } catch (error) {
        // Lỗi thường do thiếu trường dữ liệu hoặc lỗi DB
        res.status(500).json({ message: "Lỗi Server nội bộ.", error: error.message });
    }
};
    exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // B1: Tìm User
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
        }

        // B2: So sánh Mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Sai email hoặc mật khẩu." });
        }

        // B3: Tạo JWT Token
        const token = jwt.sign(
            { userId: user._id, role: user.role }, 
            process.env.JWT_SECRET, // Khóa bí mật từ .env
            { expiresIn: '1h' }     // Hạn token: 1 giờ
        ); 

        // B4: Phản hồi
        res.status(200).json({ 
            token, 
            user: { id: user._id, name: user.name, role: user.role } 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server nội bộ.", error: error.message });
    }

};
exports.logout = (req, res) => {
    // Việc xóa token (thường lưu ở Local Storage/Cookie) được xử lý phía client
    res.status(200).json({ message: "Đăng xuất thành công." });
};