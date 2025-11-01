import React, { useState, useEffect } from "react";
import axios from "axios";
import UserList from './UserList';
import AddUser from './AddUser';
import EditUser from './EditUser';

// Cấu hình URL Backend
const API_BASE_URL = 'http://localhost:5000'; // Dựa trên mã bạn cung cấp
const API_USERS_ENDPOINT = `${API_BASE_URL}/api/users`;

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State để lưu trữ người dùng đang được chỉnh sửa (hoặc null)
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
      setError("Lỗi kết nối Backend. Vui lòng kiểm tra Server Node.js đã chạy chưa (Cổng 5000).");
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
    // Thêm người dùng mới vào đầu danh sách (Hoặc gọi lại fetchUsers())
    setUsers((prevUsers) => [newUser, ...prevUsers]); 
  };

  // DELETE: Xử lý xóa người dùng
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ID ${id}?`)) {
      return;
    }

    try {
      await axios.delete(`${API_USERS_ENDPOINT}/${id}`); // GỌI DELETE
      // Lọc bỏ người dùng đã xóa khỏi state
      setUsers(users.filter(user => user.id !== id)); 
    } catch (err) {
      console.error("Lỗi khi xóa người dùng:", err);
      alert("Xóa thất bại. Kiểm tra console."); 
    }
  };

  // HÀM SỬA 1: Bật chế độ chỉnh sửa (Được gọi từ UserList)
  // **VỊ TRÍ NÀY QUAN TRỌNG ĐỂ KHÔNG GẶP LỖI ReferenceError**
  const handleEdit = (user) => {
    setEditingUser(user);
  };
  
  // HÀM HỦY: Tắt chế độ chỉnh sửa
  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  // HÀM SỬA 2: Xử lý cập nhật người dùng (GỌI API PUT)
  const handleUpdate = async (id, updatedData) => {
    try {
      // GỌI PUT tới /api/users/:id
      const response = await axios.put(`${API_USERS_ENDPOINT}/${id}`, updatedData);

      // Cập nhật state (thay thế đối tượng cũ bằng đối tượng mới trả về)
      setUsers(users.map(user => 
        user.id === id ? response.data : user
      ));
      
      handleCancelEdit(); // Đóng form chỉnh sửa khi cập nhật thành công
      return true;
    } catch (err) {
      console.error("Lỗi khi cập nhật người dùng:", err);
      alert("Cập nhật thất bại. Kiểm tra console.");
      return false;
    }
  };


  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Đang tải dữ liệu...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>QUẢN LÝ NGƯỜI DÙNG (CRUD)</h1>

      {/* Logic hiển thị Form Thêm hoặc Form Sửa */}
      <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#f9f9f9' }}>
        {editingUser ? (
          // HIỂN THỊ FORM SỬA
          <EditUser 
            userToEdit={editingUser}
            handleUpdate={handleUpdate}
            handleCancel={handleCancelEdit}
          />
        ) : (
          // HIỂN THỊ FORM THÊM MỚI
          <AddUser 
            onUserAdded={handleUserAdded} 
            apiEndpoint={API_USERS_ENDPOINT} 
          />
        )}
      </div>
      
      {/* Hiển thị danh sách và xử lý lỗi */}
      {error ? (
        <div style={{ /* ... style error ... */ }}>
          <h2>Lỗi!</h2>
          <p>{error}</p>
          <button onClick={fetchUsers} /* ... */>Thử tải lại</button>
        </div>
      ) : (
        // TRUYỀN HÀM XỬ LÝ ĐỂ USERLIST GỌI KHI NHẤN SỬA/XÓA
        <UserList 
          users={users} 
          handleDelete={handleDelete} 
          handleEdit={handleEdit} 
        />
      )}
    </div>
  );
}

export default App;