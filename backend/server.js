// File: backend/server.js
require('dotenv').config(); // <--- THÊM DÒNG NÀY (Để đọc file .env)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // <--- THÊM DÒNG NÀY


const app = express();
app.use(cors());
app.use(express.json());

// --- KẾT NỐI MONGODB ---
// Lấy chuỗi kết nối từ file .env
const uri = process.env.MONGO_URI; 
mongoose.connect(uri); // Bắt đầu kết nối

const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully!");
});
// --- KẾT THÚC KẾT NỐI ---


// Import user routes
const userRoutes = require('./routes/user');
app.use('/users', userRoutes);

// PORT này giờ sẽ lấy từ file .env
const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));