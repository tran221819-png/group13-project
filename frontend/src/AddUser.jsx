import React, { useState } from 'react';
import axios from 'axios';

// Component này nhận apiEndpoint từ App.js (lý tưởng hơn là hardcode IP)
// Cấu hình IP và API_URL nên được xử lý trong App.js và truyền qua props.
const AddUser = ({ onUserAdded, apiEndpoint }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Thêm state để quản lý thông báo lỗi validation/API
  const [error, setError] = useState(null); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // BƯỚC 1: VALIDATION FORM (Tối ưu hóa từ cả hai phiên bản)
    if (!name.trim()) {
      setError("Tên không được để trống.");
      return;
    }
    // Validation email cơ bản (theo hướng dẫn Hoạt động 6/8)
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email không hợp lệ.");
      return;
    }

    setIsSubmitting(true);

    try {
      // BƯỚC 2: GỬI POST REQUEST (Sử dụng apiEndpoint truyền từ App.js)
      const newUser = { name, email };
      const response = await axios.post(apiEndpoint, newUser);
      
      // Reset form
      setName('');
      setEmail('');
      
      // Gọi callback để cập nhật state trong App.js
      if (onUserAdded) {
        onUserAdded(response.data);
      }

    } catch (err) {
      console.error("Lỗi khi thêm người dùng:", err);
      // Lấy thông báo lỗi chi tiết hơn từ server nếu có
      const errorMessage = err.response?.data?.message || "Lỗi kết nối Backend hoặc lỗi Server.";
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', marginBottom: '20px', border: '1px solid #ccc', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px', color: '#007bff' }}>
        Thêm Người Dùng Mới
      </h2>
      <form onSubmit={handleSubmit}>
        
        {/* Input Tên */}
        <div style={{ marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Nhập Tên người dùng"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isSubmitting}
            required
          />
        </div>

        {/* Input Email */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="email"
            placeholder="Nhập Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
            disabled={isSubmitting}
            required
          />
        </div>
        
        {/* Hiển thị lỗi */}
        {error && (
          <p style={{ color: '#dc3545', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>
            {error}
          </p>
        )}

        {/* Nút Submit đã đổi thành "Thêm" và có màu xanh lá cây */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: isSubmitting ? '#90CAF9' : '#28a745', // Đổi màu xanh dương sang xanh lá cây
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
