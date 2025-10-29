// UserList.jsx
import React from 'react';
import axios from 'axios'; 

// Đưa URL ra ngoài component để dễ quản lý và sử dụng lại
const API_BASE_URL = 'http://localhost:3000'; 
// Đường dẫn /api/users khớp với server.js
const API_USERS_ENDPOINT = `${API_BASE_URL}/api/users`;

// Cần nhận setUsers và handleEdit từ component cha
const UserList = ({ users = [], setUsers, handleEdit }) => {
    
    // Xử lý sự kiện Xóa
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
            return;
        }

        try {
            // Gọi API DELETE sử dụng endpoint đã định nghĩa
            await axios.delete(`${API_USERS_ENDPOINT}/${id}`); 
            
            // Cập nhật state theo yêu cầu Hoạt động 7
            setUsers(users.filter(user => user.id !== id)); 
            alert("Xóa người dùng thành công!");
        } catch (error) {
            console.error("Lỗi khi xóa người dùng:", error);
            alert("Đã xảy ra lỗi khi xóa người dùng.");
        }
    };

    return (
        // ... code giao diện ...
        <ul style={{ listStyleType: 'none', padding: 0 }}>
            {users.map((user) => (
                <li key={user.id || user.name}>
                    <div>
                        <strong>Tên:</strong> {user.name} - <strong>Email:</strong> {user.email}
                    </div>
                    
                    <div>
                        {/* Nút Sửa */}
                        <button onClick={() => handleEdit(user)}>Sửa</button> 
                        
                        {/* Nút Xóa */}
                        <button onClick={() => handleDelete(user.id)}>Xóa</button> 
                    </div>
                </li>
            ))}
        </ul>
        // ... code giao diện ...
    );
};

export default UserList;