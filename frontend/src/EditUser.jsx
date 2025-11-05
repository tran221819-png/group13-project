import React, { useState } from 'react';

// Component này nhận userToEdit, handleUpdate và handleCancel từ App.js
const EditUser = ({ userToEdit, handleUpdate, handleCancel }) => {
  // 1. Khởi tạo state với dữ liệu hiện tại của userToEdit
  const [name, setName] = useState(userToEdit.name || '');
  const [email, setEmail] = useState(userToEdit.email || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Validation (tương tự như AddUser)
    if (!name.trim()) {
      alert("Tên không được để trống");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("Email không hợp lệ");
      return;
    }
    
    // Dữ liệu mới cần cập nhật
    const updatedData = { name, email };
    
    // 3. Gọi hàm handleUpdate từ App.js, truyền ID và dữ liệu mới
    // handleUpdate sẽ gọi API PUT và handleCancelEdit nếu thành công.
    const success = await handleUpdate(userToEdit.id, updatedData);

    // Lưu ý: Không cần reset form ở đây vì App.js sẽ gọi handleCancelEdit() 
    // để chuyển về form AddUser (hoặc reset userToEdit) nếu thành công.
  };

  return (
    <div style={{ border: '2px solid #ffc107', padding: '15px', borderRadius: '8px', backgroundColor: '#fffbe6' }}>
      <h2 style={{ color: '#ffc107' }}>Sửa Thông Tin User ID: {userToEdit.id}</h2>
      <form onSubmit={handleSubmit}>
        
        {/* Input Tên */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Tên:</label>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>

        {/* Input Email */}
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            required
          />
        </div>
        
        {/* Các nút Thao tác */}
        <button 
          type="submit" 
          style={{ padding: '10px 15px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '3px', cursor: 'pointer', marginRight: '10px' }}
        >
          Cập Nhật User
        </button>

        <button 
          type="button" 
          onClick={handleCancel} // Gọi hàm hủy từ App.js
          style={{ padding: '10px 15px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}
        >
          Hủy Bỏ
        </button>
      </form>
    </div>
  );
};

export default EditUser;