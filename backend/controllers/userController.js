// controllers/userController.js

const User = require('../models/User'); 
const bcrypt = require('bcrypt');       

// ----------------------------------------------------------------------
// 1. GET: Lấy tất cả người dùng (Đã chuyển sang Mongoose)
// ----------------------------------------------------------------------
exports.getUsers = async (req, res) => {
    try {
        // Lấy tất cả user, không lấy mật khẩu
        const users = await User.find().select('-password'); 
        
        // Chuyển đổi _id thành id ở Frontend để tương thích nếu cần
        const safeUsers = users.map(user => ({
            id: user._id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            // Thêm các trường khác như dob, hometown nếu có
        }));
        
        res.json(safeUsers);
    } catch (error) {
        console.error('Lỗi khi lấy danh sách user:', error);
        res.status(500).json({ message: 'Lỗi server khi truy vấn DB.' });
    }
};

// ----------------------------------------------------------------------
// 2. POST: Tạo người dùng mới (Giữ nguyên logic tạo User)
// ----------------------------------------------------------------------
exports.createUser = async (req, res) => {
    try {
        // Hàm này thường chỉ dùng cho Admin, nếu bạn muốn dùng cho Đăng ký, 
        // hãy dùng authController.signUp.
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password) {
            return res.status(400).json({ message: "Tên, Email và Mật khẩu là bắt buộc" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
             return res.status(400).json({ message: "Email đã tồn tại." });
        }
        
        const newUser = new User({ 
            name, 
            email, 
            password, // Mongoose Model sẽ hash nó
            role: role || 'User' 
        });
        
        await newUser.save();
        
        res.status(201).json({ id: newUser._id, name: newUser.name, email: newUser.email, role: newUser.role });

    } catch (error) {
        console.error('Lỗi khi tạo user:', error);
        res.status(500).json({ message: 'Lỗi server khi tạo user.' });
    }
};

// ----------------------------------------------------------------------
// 3. PUT: Cập nhật User (Đã chuyển sang Mongoose, dùng ID chuỗi)
// ----------------------------------------------------------------------
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const { 
            name, 
            email, 
            dob, 
            hometown,
            newPassword, 
            currentPassword 
        } = req.body;

        // B1: Tìm người dùng trong DB
        const user = await User.findById(id).select('+password');

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng (ID không tồn tại).' });
        }
        
        // B2: (Quan trọng) Kiểm tra quyền tự cập nhật
        // Nếu user đã đăng nhập (req.user có sẵn từ authMiddleware)
        // và ID trong URL không phải ID của họ (và họ không phải Admin)
        if (req.user && req.user._id.toString() !== id.toString() && req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật hồ sơ của người dùng khác.' });
        }
        
        // B3: Cập nhật thông tin chung
        if (name) user.name = name;
        if (email) user.email = email;
        if (dob) user.dob = dob;
        if (hometown) user.hometown = hometown;
        
        // B4: Logic Đổi Mật khẩu (Chỉ áp dụng cho người dùng tự cập nhật)
        if (newPassword && req.user && req.user._id.toString() === id.toString()) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại.' });
            }
            // So sánh mật khẩu hiện tại
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // B5: Lưu thay đổi và trả về
        await user.save();
        
        // Trả về đối tượng đã loại bỏ mật khẩu
        res.json({ 
            message: 'Cập nhật hồ sơ thành công!',
            user: {
                id: user._id,
                email: user.email,
                name: user.name, 
                dob: user.dob,
                hometown: user.hometown,
                role: user.role
            }
        });

    } catch (error) {
        if (error.code === 11000) {
             return res.status(400).json({ message: 'Email này đã được người dùng khác sử dụng.' });
        }
        console.error('Lỗi khi cập nhật hồ sơ:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};

// ----------------------------------------------------------------------
// 4. DELETE: Xóa user (Đã chuyển sang Mongoose)
// ----------------------------------------------------------------------
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // (Tùy chọn) Kiểm tra quyền Admin trước khi xóa người khác
        if (req.user && req.user.role !== 'Admin' && req.user._id.toString() !== id.toString()) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa người dùng này.' });
        }

        const result = await User.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: `User with ID ${id} deleted successfully` });
        
    } catch (error) {
        console.error('Lỗi khi xóa user:', error.message);
        res.status(500).json({ message: 'Lỗi server khi xóa user.' });
    }
};