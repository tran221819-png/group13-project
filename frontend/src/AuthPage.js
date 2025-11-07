import React, { useState } from 'react';
import axios from 'axios';

// Giả định backend chạy ở cổng 5000
const API_URL = 'http://localhost:5000/auth'; 

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Sign Up
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Hàm chuyển đổi giữa Login và Sign Up
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      let endpoint = isLogin ? `${API_URL}/login` : `${API_URL}/signup`;
      let data = isLogin 
        ? { email, password } 
        : { name, email, password };

      const response = await axios.post(endpoint, data);

      if (isLogin) {
        // Đăng nhập thành công: Lưu JWT Token vào localStorage
        const token = response.data.token;
        localStorage.setItem('token', token);
        setMessage('Đăng nhập thành công! Token đã được lưu. (Chuyển hướng người dùng...)');
        // Ở ứng dụng thực tế: Thêm logic chuyển hướng đến trang Home/Profile
        console.log('Token đã lưu:', token);
      } else {
        // Đăng ký thành công
        setMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true); // Chuyển sang form Login
      }
    } catch (error) {
      // Xử lý lỗi từ Backend
      const errorMsg = error.response?.data?.message || 'Lỗi kết nối hoặc xử lý API.';
      setMessage(`Lỗi: ${errorMsg}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border-t-4 border-indigo-500">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {isLogin ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}
        </h2>
        
        <form onSubmit={handleAuth} className="space-y-6">
          {!isLogin && (
            <input
              type="text"
              placeholder="Họ và Tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
          />
          
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 transform hover:scale-[1.01]"
          >
            {isLogin ? 'Đăng Nhập' : 'Đăng Ký'}
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${message.startsWith('Lỗi') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={toggleMode}
            className="text-indigo-600 hover:text-indigo-800 font-medium transition duration-150"
          >
            {isLogin 
              ? 'Chưa có tài khoản? Đăng ký ngay!' 
              : 'Đã có tài khoản? Đăng nhập!'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

// Component chính để hiển thị AuthPage (Nếu bạn muốn kiểm tra ngay, 
// bạn có thể đặt nó trong file index.js hoặc App.js của React)
const App = () => (
  <div className="font-sans">
    <AuthPage />
  </div>
);

export default App;