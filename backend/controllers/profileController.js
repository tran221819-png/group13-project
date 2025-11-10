const bcrypt = require('bcrypt'); // Đảm bảo import thư viện bcrypt chuẩn
const User = require('../models/User'); // PHẢI DÙNG MODEL THỰC TẾ

/**
 * @route GET /api/users/profile 
 * @desc Lấy thông tin hồ sơ của người dùng đã đăng nhập (req.user)
 * @access Private
 */
exports.getProfile = async (req, res) => {
    try {
        // req.user được thêm vào từ authMiddleware, chỉ chứa id và role
        const userId = req.user.userId; 

        // 1. Tìm người dùng trong DB, loại trừ trường password
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy hồ sơ người dùng.' });
        }

        // 2. Trả về thông tin hồ sơ
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            dob: user.dob,
            hometown: user.hometown,
            createdAt: user.createdAt
        });

    } catch (error) {
        console.error('Lỗi khi lấy hồ sơ:', error.message);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ khi lấy hồ sơ.' });
    }
};

/**
 * @route PUT /api/users/profile 
 * @desc Cập nhật hồ sơ người dùng đã đăng nhập
 * @access Private
 */
exports.updateProfile = async (req, res) => {
    try {
        // Lấy đối tượng user đã được gắn vào req bởi authMiddleware
        // Cần tìm lại user với password (select('+password')) nếu muốn đổi mật khẩu
        const user = await User.findById(req.user.userId).select('+password'); 
        
        if (!user) {
            return res.status(401).json({ message: 'Lỗi xác thực. Không tìm thấy người dùng.' });
        }
        
        // 2. Lấy dữ liệu và cập nhật thông tin chung
        const { 
            name, email, dob, hometown, newPassword, currentPassword 
        } = req.body;

        if (name) user.name = name;
        if (email && email !== user.email) {
            // Kiểm tra trùng email nếu người dùng thay đổi email
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== user._id.toString()) {
                 return res.status(400).json({ message: 'Email này đã được người dùng khác sử dụng.' });
            }
            user.email = email;
        }
        
        // Chỉ cập nhật dob/hometown nếu chúng được gửi lên
        if (dob) user.dob = dob;
        if (hometown) user.hometown = hometown;
        
        // 3. Logic Đổi Mật khẩu
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: 'Vui lòng cung cấp mật khẩu hiện tại.' });
            }
            
            // So sánh mật khẩu hiện tại (user đã được select('+password'))
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Mật khẩu hiện tại không đúng.' });
            }

            // Gán mật khẩu thô mới. Hook pre('save') trong Model sẽ tự động hash.
            user.password = newPassword; 
        }

        // 4. Lưu thay đổi
        await user.save();
        
        // Trả về thông tin user đã cập nhật (không kèm password)
        // Lưu ý: Cần fetch lại user mà không có password để tránh lộ thông tin nếu bạn không dùng user.toObject()
        const updatedUser = await User.findById(user._id).select('-password');


        res.json({ 
            message: 'Cập nhật hồ sơ thành công!',
            user: { 
                id: updatedUser._id, 
                email: updatedUser.email, 
                name: updatedUser.name, 
                role: updatedUser.role,
                dob: updatedUser.dob,
                hometown: updatedUser.hometown
            }
        });

    } catch (error) {
        console.error('Lỗi khi cập nhật hồ sơ:', error.message);

        // Xử lý lỗi Mongoose Validation (ví dụ: mật khẩu quá ngắn)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }

        res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
    }
};