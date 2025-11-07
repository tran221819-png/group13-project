const express = require('express');
const mongoose = require('mongoose'); // Cần cho MongoDB
const dotenv = require('dotenv'); // Cần để đọc MONGO_URI
const cors = require('cors'); 

// Import Tuyến đường Auth và User
// Lưu ý: Tuyến đường này phải sử dụng cú pháp CommonJS (require)
const authRoutes = require('./routes/auth'); // Tuyến đường cho Đăng ký/Đăng nhập
const userRoutes = require('./routes/user'); // Tuyến đường cho CRUD User

// Load biến môi trường từ .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
// Lấy cổng từ .env hoặc mặc định là 5000
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- KẾT NỐI MONGODB (Quan trọng nhất) ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB database connection established successfully!'))
    .catch(err => console.error('❌ MongoDB connection error. Vui lòng kiểm tra MONGO_URI trong .env', err));


// --- MIDDLEWARE ---
// Cấu hình CORS để chỉ cho phép Frontend từ localhost:3000 truy cập
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
// Cho phép Express đọc JSON từ request body
app.use(express.json());


// --- ĐỊNH TUYẾN (ROUTES) ---
// 1. Tuyến đường XÁC THỰC (Hoạt động 1, Buổi 5)
// Base URL: /auth (Frontend gọi /auth/login, /auth/signup)
app.use('/auth', authRoutes); 

// 2. Tuyến đường CRUD User (CRUD cũ từ Buổi 4)
// Base URL: /users (Frontend gọi /users, /users/:id)
// LƯU Ý: Nếu bạn dùng /api/users trước đây, bạn có thể thay đổi /users thành /api/users
app.use('/users', userRoutes); 


// Tuyến đường mặc định
app.get('/', (req, res) => {
    res.send(`Server Node.js đang chạy ổn định trên cổng ${PORT}.`);
});


// Lắng nghe cổng
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});