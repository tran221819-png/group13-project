// Import các thư viện cần thiết
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Đảm bảo bạn đã cài đặt: npm install cors

// Khởi tạo ứng dụng Express
const app = express();
const PORT = 5000;

// Import Controller chứa logic xử lý
const userController = require('./controllers/userController'); 

// --- MIDDLEWARE ---
// Sử dụng body-parser để phân tích dữ liệu JSON trong yêu cầu
app.use(bodyParser.json());

// Cấu hình CORS để chỉ cho phép Frontend từ localhost:3000 truy cập
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// --- ĐỊNH TUYẾN (ROUTES) TRỰC TIẾP TRONG server.js ---
// Base URL cho tất cả routes là /api/users

// GET /api/users - Lấy tất cả user
app.get('/api/users', userController.getUsers);

// POST /api/users - Tạo user mới
app.post('/api/users', userController.createUser);

// PUT /api/users/:id - Cập nhật user theo ID
app.put('/api/users/:id', userController.updateUser);

// DELETE /api/users/:id - Xóa user theo ID
app.delete('/api/users/:id', userController.deleteUser);


// Lắng nghe cổng
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
