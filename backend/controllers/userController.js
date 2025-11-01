// controllers/userController.js
let users = []; // Mảng tạm để lưu trữ user, thay thế bằng MongoDB sau [cite: 52, 115]
let nextId = 1;

// GET: Lấy tất cả người dùng
exports.getUsers = (req, res) => {
    res.json(users);
};

// POST: Tạo người dùng mới
exports.createUser = (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "Name and email are required" });
    }
    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
};

// PUT: Sửa user (DÙNG MẢNG TẠM)
exports.updateUser = (req, res) => {
    // 1. Lấy ID từ URL (luôn là string)
    const { id } = req.params; 
    const { name, email } = req.body; // Lấy dữ liệu mới từ body

    // 2. Chuyển đổi ID từ string sang number để so sánh với id trong mảng
    const targetId = parseInt(id); 

    // 3. Tìm index của người dùng
    const index = users.findIndex(u => u.id === targetId);

    if (index !== -1) {
        // 4. Cập nhật thông tin
        users[index] = {
            ...users[index], // Giữ lại các thuộc tính cũ (ví dụ: id)
            name: name,      // Cập nhật tên mới
            email: email     // Cập nhật email mới
        };

        // 5. Trả về đối tượng đã được cập nhật
        res.json(users[index]);
    } else {
        // Không tìm thấy user
        res.status(404).json({ message: "User not found" });
    }
};

// DELETE: Xóa user
exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const targetId = parseInt(id);

    // Filter ra khỏi mảng những user có id khác với id cần xóa
    const initialLength = users.length;
    users = users.filter(u => u.id !== targetId);

    if (users.length < initialLength) {
        res.json({ message: `User with ID ${id} deleted successfully` });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};