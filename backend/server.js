// Cần để đọc MONGO_URI
const dotenv = require('dotenv'); 
// Cần cho MongoDB
const mongoose = require('mongoose'); 
const express = require('express');

const cors = require('cors'); 

// --- 1. Import Tuyến đường ---
// Tuyến đường cho Đăng ký/Đăng nhập
const auth = require('./routes/auth'); 
// Tuyến đường cho CRUD User (Đã đổi tên biến thành 'user')
const user = require('./routes/user'); 

// Load biến môi trường từ .env
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();

// Lấy cổng và URI từ biến môi trường
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Kiểm tra MONGO_URI trước khi kết nối (Khuyến nghị)
if (!MONGO_URI) {
    console.error('❌ LỖI: MONGO_URI không được định nghĩa trong file .env');
    // Thoát ứng dụng nếu không có URI
    process.exit(1);
}

// --- 2. KẾT NỐI MONGODB ---
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB database connection established successfully!'))
    .catch(err => {
        console.error('❌ MongoDB connection error. Vui lòng kiểm tra MONGO_URI trong .env', err);
        // Thoát ứng dụng nếu kết nối DB thất bại
        process.exit(1); 
    });


// --- 3. MIDDLEWARE ---
// Cấu hình CORS để chỉ cho phép Frontend từ localhost:3000 truy cập
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Cho phép Express đọc JSON từ request body
app.use(express.json());


// --- 4. ĐỊNH TUYẾN (ROUTES) ---

app.use('/api/auth', auth); 
app.use('/api/users', user); 


// Tuyến đường mặc định (Health Check)
app.get('/', (req, res) => {
    res.status(200).send(`Server Node.js đang chạy ổn định trên cổng ${PORT}. Kết nối DB đã thiết lập.`);
});

// --- 5. KHỞI CHẠY SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});