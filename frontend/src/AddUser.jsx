import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Địa chỉ API (Phải khớp với cổng của Server Node.js)
const API_BASE_URL = 'http://localhost:5000'; 
// Đường dẫn /api/users khớp với server.js
const API_USERS_ENDPOINT = `${API_BASE_URL}/api/users`;

// Component nhận các props cho chế độ Sửa (editingUser) và các hàm callback
const AddUser = ({ editingUser, onUserAdded, onUserUpdated, onCancelEdit }) => {
    // State cục bộ quản lý form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // useEffect: Điền dữ liệu vào form khi chuyển sang chế độ Sửa
    useEffect(() => {
        if (editingUser) {
            // Chế độ Sửa: Điền dữ liệu hiện tại
            setName(editingUser.name || '');
            setEmail(editingUser.email || ''); 
        } else {
            // Chế độ Thêm: Reset form
            setName('');
            setEmail('');
        }
        setError(null);
    }, [editingUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // 🟢 VALIDATION (Hoạt động 8)
        if (!name.trim()) {
            setError("Tên không được để trống.");
            return;
        }
        // Validation cho Email
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { 
            setError("Email là bắt buộc và phải hợp lệ (ví dụ: a@b.com).");
            return;
        }
        
        setIsSubmitting(true);
        // Dữ liệu gửi đi bao gồm cả name và email
        const data = { name, email }; 
        
        try {
            if (editingUser) {
                // 🟢 TRƯỜNG HỢP 1: CẬP NHẬT (PUT)
                const apiUrl = `${API_USERS_ENDPOINT}/${editingUser.id}`;
                const response = await axios.put(apiUrl, data);
                
                onUserUpdated(response.data); // Cập nhật state ở App.js
                alert("Cập nhật người dùng thành công!");
            } else {
                // 🟢 TRƯỜNG HỢP 2: THÊM MỚI (POST)
                const response = await axios.post(API_USERS_ENDPOINT, data); 
                
                onUserAdded(response.data); // Cập nhật state ở App.js
                alert("Thêm người dùng thành công!");
                
                // Reset form sau khi thêm
                setName('');
                setEmail('');
            }
        } catch (err) {
            console.error("Lỗi khi gửi dữ liệu:", err);
            alert("Lỗi kết nối hoặc lỗi server. Vui lòng kiểm tra Server Node.js đã chạy chưa.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const formTitle = editingUser ? `SỬA NGƯỜI DÙNG ID: ${editingUser.id}` : 'Thêm người dùng';
    const buttonText = editingUser ? 'Cập nhật' : 'Thêm';

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
            <h3 style={{ marginTop: 0, color: editingUser ? '#007bff' : '#333' }}>{formTitle}</h3>
            <form onSubmit={handleSubmit}>
                {/* INPUT TÊN */}
                <input 
                    type="text"
                    placeholder="Nhập Tên người dùng"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    style={{ padding: '10px', margin: '5px 0', width: '97%', display: 'block', border: '1px solid #ddd' }}
                />
                
                {/* 🟢 INPUT EMAIL */}
                <input 
                    type="email"
                    placeholder="Nhập Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={{ padding: '10px', margin: '5px 0', width: '97%', display: 'block', border: '1px solid #ddd' }}
                />
                
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <div style={{ marginTop: '15px' }}>
                    <button type="submit" disabled={isSubmitting} 
                        style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        {isSubmitting ? 'Đang xử lý...' : buttonText}
                    </button>
                    
                    {/* Nút Hủy chỉ hiển thị trong chế độ Sửa */}
                    {editingUser && (
                        <button type="button" onClick={onCancelEdit} 
                            style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default AddUser;
