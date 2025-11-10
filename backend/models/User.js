const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Thư viện để mã hóa mật khẩu

// Định nghĩa cấu trúc (Schema) cho Người dùng
const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Tên người dùng là bắt buộc'], 
        trim: true,
        maxlength: [50, 'Tên không được quá 50 ký tự'] // Thêm giới hạn
    },
    email: { 
        type: String, 
        required: [true, 'Email là bắt buộc'], 
        unique: true, // Đảm bảo email không trùng lặp
        lowercase: true, // Chuyển email về chữ thường trước khi lưu
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Định dạng email không hợp lệ']
    },
    password: { 
        type: String, 
        required: [true, 'Mật khẩu là bắt buộc'], 
        minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'], // Thêm giới hạn
        select: false // Mặc định không trả về trường này khi tìm kiếm
    },
    role: { 
        type: String, 
        enum: ['User', 'Admin'], // Chỉ cho phép 2 giá trị này
        default: 'User' 
    },
    // Thông tin Hồ sơ (Profile)
    dob: { // Ngày sinh
        type: Date, 
        default: null 
    },
    hometown: { // Quê quán/Thành phố
        type: String, 
        trim: true,
        default: '' // Đổi về chuỗi rỗng để tránh nhầm lẫn
    },
}, {
    timestamps: true // Tự động thêm createdAt và updatedAt
});

// --- HOOK TRƯỚC KHI LƯU (PRE-SAVE HOOK) ---
// Chức năng: Tự động hash mật khẩu khi người dùng tạo mới hoặc cập nhật mật khẩu
userSchema.pre('save', async function (next) {
    // Chỉ hash nếu trường 'password' đã bị thay đổi (tạo mới hoặc cập nhật)
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Tạo salt
        const salt = await bcrypt.genSalt(10);
        // Hash mật khẩu (mật khẩu thô) với salt
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error("Lỗi khi hash mật khẩu:", error);
        next(error); // Chuyển lỗi xuống cho Mongoose
    }
});

// --- PHƯƠNG THỨC SO SÁNH MẬT KHẨU ---
/**
 * So sánh mật khẩu thô do người dùng nhập với mật khẩu đã hash trong DB.
 * @param {string} candidatePassword - Mật khẩu thô người dùng nhập (ví dụ: '123456')
 * @returns {Promise<boolean>} - Trả về true nếu khớp, false nếu không.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
    // Lưu ý: Vì password có select: false, ta phải dùng this.password.
    // Nếu bạn không dùng this.password, hãy đảm bảo bạn đã dùng .select('+password') khi tìm user.
    return await bcrypt.compare(candidatePassword, this.password);
};


// Xuất Model 'User'
module.exports = mongoose.model('User', userSchema);