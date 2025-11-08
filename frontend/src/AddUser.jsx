import React, { useState, useEffect } from 'react';

// Xóa bỏ: import axios from 'axios'; 
// Chúng ta sẽ nhận API instance qua props

// CHỈNH SỬA: Thêm prop 'api' vào danh sách props
const AddUser = ({ editingUser, onUserAdded, onUserUpdated, onCancelEdit, api }) => {
    // State cục bộ quản lý form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    // THÊM: State cho Password và Xác nhận Password
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // useEffect: Điền dữ liệu vào form khi chuyển sang chế độ Sửa
    useEffect(() => {
        if (editingUser) {
            // Chế độ Sửa: Điền dữ liệu hiện tại (KHÔNG điền mật khẩu)
            setName(editingUser.name || '');
            setEmail(editingUser.email || ''); 
            // Reset mật khẩu khi chuyển sang chế độ sửa
            setPassword(''); 
            setConfirmPassword(''); 
        } else {
            // Chế độ Thêm: Reset form
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        }
        setError(null);
    }, [editingUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // 🟢 VALIDATION
        if (!name.trim()) {
            setError("Tên không được để trống.");
            return;
        }
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { 
            setError("Email là bắt buộc và phải hợp lệ (ví dụ: a@b.com).");
            return;
        }

        // Tạo đối tượng dữ liệu cơ bản
        let data = { name, email };
        
        // --- LOGIC XỬ LÝ MẬT KHẨU ---
        if (!editingUser) {
            // TRƯỜNG HỢP THÊM MỚI: Mật khẩu là BẮT BUỘC
            if (!password || password.length < 6) {
                 setError("Mật khẩu là bắt buộc và phải có ít nhất 6 ký tự.");
                 return;
            }
            if (password !== confirmPassword) {
                 setError("Mật khẩu xác nhận không khớp.");
                 return;
            }
            data.password = password;
        } else if (password) {
            // TRƯỜNG HỢP CẬP NHẬT & NGƯỜI DÙNG CÓ NHẬP MẬT KHẨU MỚI
            if (password !== confirmPassword) {
                 setError("Mật khẩu xác nhận không khớp.");
                 return;
            }
            data.password = password;
        }
        
        setIsSubmitting(true);
        
        try {
            if (editingUser) {
                // 🟢 TRƯỜNG HỢP 1: CẬP NHẬT (PUT)
                const response = await api.put(`/users/${editingUser.id}`, data); 
                
                onUserUpdated(response.data); 
                alert("Cập nhật người dùng thành công!");
                onCancelEdit(); // Đóng form sửa sau khi cập nhật thành công
            } else {
                // 🟢 TRƯỜNG HỢP 2: THÊM MỚI (POST) - API này có thể được coi là /signup
                const response = await api.post('/users', data); 
                
                onUserAdded(response.data); 
                alert("Thêm người dùng thành công!");
                
                // Reset form sau khi thêm
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }
        } catch (err) {
            console.error("Lỗi khi gửi dữ liệu:", err.response || err);
            const msg = err.response?.data?.message || 'Lỗi: Kiểm tra Backend (Token hợp lệ?).';
            setError(msg);

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

                <p style={{ marginTop: '10px', marginBottom: '5px', color: editingUser ? '#007bff' : '#333' }}>
                    {editingUser ? 'Nhập mật khẩu mới (Bỏ trống để giữ mật khẩu cũ):' : 'Mật khẩu (Bắt buộc):'}
                </p>

                {/* INPUT MẬT KHẨU */}
                <input 
                    type="password"
                    placeholder="Mật khẩu (ít nhất 6 ký tự)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isSubmitting}
                    style={{ padding: '10px', margin: '5px 0', width: '97%', display: 'block', border: '1px solid #ddd' }}
                />

                {/* INPUT XÁC NHẬN MẬT KHẨU */}
                <input 
                    type="password"
                    placeholder="Xác nhận Mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
