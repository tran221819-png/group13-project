const jwt = require('jsonwebtoken');
// Thay thế bằng model User thực tế của bạn
const User = require('../models/User'); 

/**
 * Middleware xác thực người dùng
 * 1. Lấy token từ header 'Authorization'.
 * 2. Xác thực token.
 * 3. Tìm user trong DB (MongoDB).
 * 4. Gán user vào req.user để các Controller khác sử dụng.
 */
const protect = async (req, res, next) => {
    let token;

    // Kiểm tra Header Authorization (ví dụ: 'Bearer <token>')
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ chuỗi 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            // Lưu ý: JWT_SECRET phải khớp với secret key dùng trong authController.js
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');

            // Tìm người dùng trong DB dựa trên userId trong token
            // Loại trừ mật khẩu
            const user = await User.findById(decoded.userId).select('-password'); 

            if (!user) {
                return res.status(401).json({ message: 'Người dùng không tồn tại. Vui lòng đăng nhập lại.' });
            }

            // Gắn user object vào request
            req.user = user;
            next();

        } catch (error) {
            console.error('Lỗi xác thực Token:', error);
            // Lỗi token hết hạn hoặc không hợp lệ
            return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập.' });
    }
};

module.exports = protect;