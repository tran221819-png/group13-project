const express = require('express');
const cors = require('cors'); 
const app = express();

// 1. KHAI BÁO ROUTES TRƯỚC KHI SỬ DỤNG
const userRoutes = require('./routes/user'); 

// 2. CẤU HÌNH CORS VỚI CẢ IP VÀ LOCALHOST
// Cho phép cả IP thực tế (để gọi từ máy khác) và localhost (khi chạy trên cùng máy)

app.use(cors({
  origin: 'http://localhost:3000', // Hoặc dùng '*' để chấp nhận mọi nguồn
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// 3. MIDDLEWARE ĐỌC JSON BODY
app.use(express.json()); 

// 4. SỬ DỤNG ROUTES
app.use('/api', userRoutes); 

// 5. KHỞI CHẠY SERVER
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
