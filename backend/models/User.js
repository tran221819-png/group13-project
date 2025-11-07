// models/User.js
const mongoose = require('mongoose');
// Khai báo bcrypt (nếu muốn thêm logic mã hóa vào Model)
const bcrypt = require('bcrypt'); 

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true, // BẮT BUỘC: Ngăn chặn trùng lặp email
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['User', 'Admin'], // Phân quyền cơ bản
        default: 'User' 
    },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

/*
// [TÙY CHỌN] Logic bảo mật nâng cao: Mã hóa mật khẩu tự động trong Model
// Giúp đảm bảo mật khẩu luôn được hash ngay cả khi SV1 quên hash trong Controller
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
*/

module.exports = mongoose.model('User', userSchema);