// controllers/userController.js
let users = []; // Mảng tạm để lưu trữ user, thay thế bằng MongoDB sau [cite: 52, 115]
let nextId = 1;

// GET: Lấy tất cả User
exports.getUsers = (req, res) => {
    res.json(users);
};

// POST: Tạo User mới
exports.createUser = (req, res) => {
    const newUser = {
        id: nextId++,
        ...req.body // Lấy name và email từ body
    };
    users.push(newUser);
    res.status(201).json(newUser);
};

// PUT: Cập nhật User [cite: 116]
exports.updateUser = (req, res) => {
    const { id } = req.params; // Lấy id từ URL [cite: 118]
    const updateData = req.body; // Dữ liệu cần cập nhật [cite: 121]
    
    // Tìm index của user [cite: 119, 120]
    const index = users.findIndex(u => u.id == id); 
    
    if (index !== -1) { // Nếu tìm thấy [cite: 122]
        users[index] = { ...users[index], ...updateData }; // Cập nhật user [cite: 123]
        res.json(users[index]); // Trả về user đã được cập nhật [cite: 124]
    } else {
        res.status(404).json({ message: "User not found" }); // Báo lỗi 404 [cite: 126]
    }
};

// DELETE: Xóa User [cite: 129]
exports.deleteUser = (req, res) => {
    const { id } = req.params; // Lấy id từ URL [cite: 132]
    
    // Lọc ra user có id không khớp, tức là xóa user đó [cite: 133]
    users = users.filter(u => u.id != id); 
    
    // Trả về thông báo thành công (200 OK) [cite: 134]
    res.json({ message: "User deleted" });
};