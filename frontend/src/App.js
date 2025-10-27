import React, { useState, useEffect } from "react";
import axios from "axios";

import UserList from './UserList'; 
import AddUser from './AddUser'; 

const API_URL = 'http://192.168.150.16:3000/api/users';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hàm tải dữ liệu người dùng (GET)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách:", err);
      // Thông báo lỗi nếu Server Backend không chạy
      setError("Lỗi kết nối Backend. Vui lòng kiểm tra Server Node.js (cổng 3000) đã chạy chưa.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Tải dữ liệu khi component được mount lần đầu
  useEffect(() => {
    fetchUsers();
  }, []); 


  // Cập nhật state cục bộ thay vì gọi lại API GET
  const handleUserAdded = (newUser) => {
    setUsers((prevUsers) => [newUser, ...prevUsers]); 
  };

  if (loading && users.length === 0 && !error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Đang tải dữ liệu...</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        ỨNG DỤNG QUẢN LÝ NGƯỜI DÙNG (TÁCH COMPONENT)
      </h1>

      {/* Truyền hàm callback xuống AddUser */}
      <AddUser onUserAdded={handleUserAdded} />
      
      {error ? (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', borderRadius: '4px', textAlign: 'center' }}>
          <h2>Lỗi!</h2>
          <p>{error}</p>
          {/* Nút để thử gọi lại fetchUsers khi có lỗi */}
          <button onClick={fetchUsers} style={{ marginTop: '10px', padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Thử tải lại
          </button>
        </div>
      ) : (
        /* Truyền danh sách users xuống UserList */
        <UserList users={users} />
      )}
    </div>
  );
}

export default App;