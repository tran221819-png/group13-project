import React from 'react';

// Component này nhận danh sách người dùng, handleDelete và handleEdit từ App.js
const UserList = ({ users, handleDelete, handleEdit, handleUpdate }) => {
    return (
        <div style={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '20px' }}>
            <h2 style={{ color: '#007bff' }}>Danh Sách Người Dùng ({users.length})</h2>
            {users.length === 0 ? (
                <p style={{ fontStyle: 'italic' }}>Không có người dùng nào được tìm thấy.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #333' }}>
                            <th style={{ padding: '8px' }}>ID</th>
                            <th style={{ padding: '8px' }}>Tên</th>
                            <th style={{ padding: '8px' }}>Email</th>
                            <th style={{ padding: '8px' }}>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '8px' }}>{user.id}</td>
                                <td style={{ padding: '8px' }}>{user.name}</td>
                                <td style={{ padding: '8px' }}>{user.email}</td>
                                <td style={{ padding: '8px' }}>
                                    {/* Gọi hàm handleEdit được truyền từ App.js */}
                                    <button 
                                        onClick={() => handleEdit(user)}
                                        style={{ marginRight: '10px', padding: '5px 10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Sửa
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(user.id)}
                                        style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserList;
