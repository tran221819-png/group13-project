import React, { useState } from 'react';
import axios from 'axios';

const BACKEND_IP = '192.168.150.16'; 
const API_URL = `http://${BACKEND_IP}:3000/api/users`;

// Component để thêm người dùng mới
const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Kiểm tra đầu vào bắt buộc
    if (!name.trim() || !email.trim()) {
      setError("Tên và Email là bắt buộc.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Gửi yêu cầu POST lên Backend API
      const response = await axios.post(API_URL, { name, email });
      
      // Xóa form sau khi gửi thành công
      setName('');
      setEmail('');
      
      // Gọi callback để cập nhật state trong component cha (App.js)
      // Dữ liệu trả về từ API thường bao gồm ID mới
      if (onUserAdded) {
        onUserAdded(response.data);
      }

    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
      // Hiển thị lỗi từ server hoặc lỗi kết nối
      const errorMessage = err.response?.data?.message || "Lỗi kết nối Backend hoặc lỗi Server.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        Thêm người dùng
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nhập Tên người dùng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isSubmitting}
          />
        </div>
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isSubmitting}
          />
        </div>
        
        {error && (
          <p style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
backgroundColor: isSubmitting ? '#90CAF9' : '#1e88e5',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s'
          }}
        >
          {isSubmitting ? 'Đang thêm...' : 'Thêm'}
        </button>
      </form>
    </div>
  );
};

export default AddUser;