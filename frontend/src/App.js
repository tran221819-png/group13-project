import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from './UserList'; 
import AddUser from './AddUser'; 

// CẤU HÌNH API BASE URL
const API_BASE_URL = 'http://localhost:3000'; 
// Đường dẫn /api/users khớp với server.js
const API_USERS_ENDPOINT = `${API_BASE_URL}/api/users`;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const [editingUser, setEditingUser] = useState(null);

  // GET: Tải dữ liệu người dùng
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_USERS_ENDPOINT);
      setUsers(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      setError("Lỗi kết nối Backend. Vui lòng kiểm tra Server Node.js đã chạy chưa.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []); 

  // POST: Xử lý khi người dùng mới được thêm
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]); 
  };


    // DELETE: Xử lý xóa người dùng
    const handleDelete = async (id) => {
        if (!window.confirm(`Bạn có chắc chắn muốn xóa ID ${id}?`)) return;

        try {
            await axios.delete(`${API_USERS_ENDPOINT}/${id}`); // GỌI DELETE
            setUsers(users.filter(user => user.id !== id));
        } catch (err) {
            console.error("Lỗi khi xóa người dùng:", err);
            alert("Xóa thất bại. Kiểm tra console.");
        }
    };
    
    // PUT: Xử lý cập nhật người dùng
    const handleUpdate = async (id, updatedData) => {
        try {
            // GỌI PUT tới /users/:id
            const response = await axios.put(`${API_USERS_ENDPOINT}/${id}`, updatedData);
            
            // Cập nhật state
            setUsers(users.map(user => 
                user.id === id ? response.data : user
            ));
            return true;
        } catch (err) {
            console.error("Lỗi khi cập nhật người dùng:", err);
            alert("Cập nhật thất bại. Kiểm tra console.");
            return false;
        }
    };

  // ... logic loading và error ...

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>
        QUẢN LÝ NGƯỜI DÙNG
      </h1>

      <AddUser onUserAdded={handleUserAdded} apiEndpoint={API_USERS_ENDPOINT} />
      
      {error ? (
        <div style={{ /* ... */ }}>
          <h2>Lỗi!</h2>
          <p>{error}</p>
          <button onClick={fetchUsers}>Thử tải lại</button>
        </div>
      ) : (
        <UserList 
            users={users} 
            handleDelete={handleDelete} // TRUYỀN HÀM XỬ LÝ XUỐNG
            handleUpdate={handleUpdate} // TRUYỀN HÀM XỬ LÝ XUỐNG
        />
      )}
    </div>
  );
}

export default App;