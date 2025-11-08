const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Cần import bcrypt ở đây

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true, // Đảm bảo email là duy nhất
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: 'User',
        },
    },
    {
        timestamps: true,
    }
);

// Middleware Mongoose: Tự động hash mật khẩu trước khi lưu (pre 'save')
// BƯỚC NÀY CỰC KỲ QUAN TRỌNG ĐỂ ĐẢM BẢO MẬT KHẨU LUÔN ĐƯỢC HASH
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    // Dù bạn đã hash trong controller, việc này giúp code mạnh mẽ hơn.
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// THÊM phương thức so sánh mật khẩu vào Schema (Optional nhưng nên có)
// Mặc dù bạn dùng bcrypt.compare trong controller, đây là cách chuẩn Mongoose
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;