import React from 'react';

// SỬA LỖI: Cung cấp giá trị mặc định users = [] để tránh lỗi 'reading length of undefined'
const UserList = ({ users = [] }) => (
  <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
    <h2 style={{ borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '10px' }}>
      Danh sách Người dùng ({users.length})
    </h2>
    {users.length === 0 ? (
      <p>Không tìm thấy người dùng nào.</p>
    ) : (
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {users.map((user) => (
          // Đảm bảo user có thuộc tính id hoặc name để làm key
          <li key={user.id || user.name} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            <strong>Tên:</strong> {user.name} - <strong>Email:</strong> {user.email}
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default UserList;