// File: backend/controllers/userController.js

const User = require('../models/User.js'); // <--- THÊM DÒNG NÀY

// --- XÓA DÒNG NÀY ---
// let users = [ ... ]; (Xóa toàn bộ mảng này)

// --- THAY ĐỔI LỚN 1: Dùng async/await ---
// Hàm này lấy tất cả người dùng
const getAllUsers = async (req, res) => { // <-- Thêm async
    try {
        // Thay vì trả về mảng, chúng ta tìm trong CSDL
        const users = await User.find(); // Tương đương "SELECT * FROM users"
        res.status(200).json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// --- THAY ĐỔI LỚN 2: Dùng async/await và Model ---
// Hàm này tạo một người dùng mới
const createUser = async (req, res) => { // <-- Thêm async
    // Lấy thông tin user mới từ request body
    const { name, email } = req.body;
    
    // Tạo một đối tượng User mới dựa trên Model
    const newUser = new User({
        name,
        email
    });

    try {
        // Lưu user mới vào CSDL
        await newUser.save(); 
        
        // Giống Hoạt động 3: Lấy lại toàn bộ danh sách và trả về
        const allUsers = await User.find();
        res.status(201).json(allUsers); // 201 = Created

    } catch (error) {
        // (Nếu email bị trùng, nó cũng sẽ báo lỗi ở đây)
        res.status(400).json({ message: error.message }); // 400 = Bad Request
    }
};

// Đừng quên export các hàm này
module.exports = {
    getAllUsers,
    createUser
};