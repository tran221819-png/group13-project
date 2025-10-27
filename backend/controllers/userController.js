// 1. Dữ liệu tạm thời (Mô phỏng Database)
let users = [
    { id: 1, name: 'Tran', email: 'Tran@example.com' },
    { id: 2, name: 'Khoi', email: 'Khoi@example.com' },
];
let nextId = 3; // Biến dùng để tạo ID mới

// 2. [GET /users] - Lấy tất cả người dùng
const getAllUsers = (req, res) => {
    // Trả về mã 200 (OK) và mảng người dùng
    res.status(200).json(users);
};

// 3. [POST /users] - Tạo người dùng mới
const createUser = (req, res) => {
    // Lấy dữ liệu từ body của request
    const { name, email } = req.body; 

    // Kiểm tra dữ liệu đầu vào
    if (!name || !email) {
        return res.status(400).json({ message: 'Tên và Email là bắt buộc.' });
    }

    // Tạo đối tượng người dùng mới
    const newUser = {
        id: nextId++,
        name,
        email
    };

    // Thêm vào mảng tạm
    users.push(newUser);

    // Trả về mã 201 (Created) và đối tượng mới tạo
    res.status(201).json({ message: 'Tạo người dùng thành công', user: newUser });
};

// 4. Export các hàm để Route có thể sử dụng
module.exports = {
    getAllUsers,
    createUser
};