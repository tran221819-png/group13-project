import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  User, Mail, Phone, MapPin, Calendar, Edit, Save, X, LogOut, Loader2, Users, Eye
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';

// --- UTILITIES VÀ COMPONENTS NHỎ ---

// Component hiển thị thông báo Toast
const ToastMessage = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const baseClasses = "fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg font-medium transition-all duration-300 transform";
  const typeClasses = type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';

  return (
    <div className={`${baseClasses} ${typeClasses}`} role="alert">
      {message}
    </div>
  );
};

// Component Loading Overlay
const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-2xl">
    <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    <span className="ml-3 text-indigo-600 font-semibold">Đang tải...</span>
  </div>
);

// Component hiển thị một trường thông tin (Dùng cho cả View và Edit)
const InfoField = ({ icon: Icon, label, value, name, isEditing, editingData, handleChange, isLoading }) => (
  <div className="flex items-start space-x-4 p-3 border-b border-gray-100 last:border-b-0">
    <Icon className="w-5 h-5 text-indigo-500 mt-1 flex-shrink-0" />
    <div className="flex flex-col flex-grow">
      <span className="text-sm font-medium text-gray-500">{label}</span>
      {isEditing ? (
        <input
          type={name === 'birthday' ? 'date' : (name === 'email' ? 'email' : 'text')}
          name={name}
          value={editingData[name] || ''}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 transition duration-150 ease-in-out"
          disabled={isLoading || name === 'id' || name === 'email' || name === 'role'} // Không cho chỉnh sửa ID, Email, Role
        />
      ) : (
        <span className="text-base text-gray-800 font-semibold break-words mt-0.5">{value}</span>
      )}
    </div>
  </div>
);

// --- COMPONENT CHÍNH: USER PROFILE ---

const getUserDocRef = (db, appId, userId) => {
    return doc(db, `artifacts/${appId}/public/data/users`, userId);
};

// Lưu ý: db và appId được truyền từ App.jsx qua props
const ProfilePage = ({ user, currentUserId, isAdmin, db, appId, onBackToList, onProfileUpdate }) => {
  const [userData, setUserData] = useState(user);
  const [editingData, setEditingData] = useState(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Kiểm tra xem người dùng hiện tại có phải là chủ sở hữu profile này không
  const isOwner = currentUserId === user.id;
  
  // Chỉ cho phép chỉnh sửa nếu là chủ sở hữu hoặc là Admin
  const canEdit = isOwner || isAdmin;

  // Cập nhật state khi prop 'user' thay đổi (khi admin chọn người dùng khác)
  useEffect(() => {
    setUserData(user);
    setEditingData(user);
    setIsEditing(false); // Reset chế độ chỉnh sửa khi chuyển user
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    if (!canEdit) return; // Bảo vệ: không cho người dùng không có quyền lưu

    setIsLoading(true);
    setToast({ message: '', type: '' });

    try {
      const docRef = getUserDocRef(db, appId, editingData.id);
      
      // Tạo đối tượng chỉ chứa các trường cần cập nhật
      const updatePayload = {
        name: editingData.name,
        phone: editingData.phone,
        address: editingData.address,
        birthday: editingData.birthday,
      };

      // Chỉ Admin mới được phép chỉnh sửa Role
      if (isAdmin) {
          updatePayload.role = editingData.role;
      }

      await updateDoc(docRef, updatePayload);
      
      setUserData(editingData); // Cập nhật state local
      setIsEditing(false);
      setToast({ message: 'Lưu thông tin thành công!', type: 'success' });
      
      // Thông báo cho component cha (App) để cập nhật dữ liệu nếu cần
      if (onProfileUpdate) onProfileUpdate(); 

    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
      setToast({ message: 'Lỗi khi lưu thông tin. Vui lòng thử lại.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditingData(userData); // Khôi phục lại dữ liệu ban đầu
    setToast({ message: 'Đã hủy bỏ chỉnh sửa.', type: 'error' });
  };

  return (
    <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl overflow-hidden my-8 relative">
      <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast({ message: '', type: '' })} />
      {isLoading && <LoadingOverlay />}

      {/* Header */}
      <div className="p-6 bg-indigo-600 text-white flex justify-between items-center rounded-t-2xl">
        <h1 className="text-2xl font-bold">
          {isOwner ? 'Thông tin cá nhân của bạn' : `Hồ sơ: ${userData.name}`}
        </h1>
        
        {/* Action Buttons */}
        <div className="flex space-x-3">
          {onBackToList && ( // Nút quay lại chỉ hiện khi là Admin xem chi tiết
            <button
              onClick={onBackToList}
              className="flex items-center space-x-2 px-3 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
              disabled={isLoading || isEditing}
            >
              <Users className="w-5 h-5" />
              <span>{isAdmin ? 'Về DS Admin' : 'Về DS'}</span>
            </button>
          )}

          {canEdit && (isEditing ? (
            <>
              <button
                onClick={handleSaveClick}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <Save className="w-5 h-5" />
                <span>Lưu</span>
              </button>
              <button
                onClick={handleCancelClick}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl shadow-md transition duration-200 disabled:opacity-50"
                disabled={isLoading}
              >
                <X className="w-5 h-5" />
                <span>Hủy</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-medium rounded-xl shadow-md transition duration-200"
            >
              <Edit className="w-5 h-5" />
              <span>Chỉnh sửa</span>
            </button>
          ))}
        </div>
      </div>

      {/* Profile Content */}
      <div className="p-6">
        {/* User Avatar Section */}
        <div className="flex flex-col items-center mb-8 border-b pb-6">
          <div className="w-32 h-32 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-6xl font-extrabold shadow-lg border-4 border-white ring-4 ring-indigo-300">
            {userData.name ? userData.name.charAt(0) : 'U'}
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-900">{userData.name}</h2>
          <p className="text-gray-500 text-sm">{userData.email}</p>
          <div className="mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-600">
            Quyền: {userData.role === 'admin' ? 'Quản trị viên' : 'Người dùng thường'}
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-4">
          <InfoField
            icon={User}
            label="Họ và Tên"
            value={userData.name}
            name="name"
            isEditing={isEditing}
            editingData={editingData}
            handleChange={handleChange}
            isLoading={isLoading}
          />
          <InfoField
            icon={Mail}
            label="Email"
            value={userData.email}
            name="email"
            isEditing={isEditing}
            editingData={editingData}
            handleChange={handleChange}
            isLoading={isLoading}
          />
          <InfoField
            icon={Phone}
            label="Số điện thoại"
            value={userData.phone}
            name="phone"
            isEditing={isEditing}
            editingData={editingData}
            handleChange={handleChange}
            isLoading={isLoading}
          />
          <InfoField
            icon={Calendar}
            label="Ngày sinh"
            value={userData.birthday}
            name="birthday"
            isEditing={isEditing}
            editingData={editingData}
            handleChange={handleChange}
            isLoading={isLoading}
          />
          <InfoField
            icon={MapPin}
            label="Địa chỉ"
            value={userData.address}
            name="address"
            isEditing={isEditing}
            editingData={editingData}
            handleChange={handleChange}
            isLoading={isLoading}
          />
          {isAdmin && (
            <InfoField
              icon={User}
              label="Vai trò (Chỉ Admin)"
              value={userData.role}
              name="role"
              isEditing={isEditing}
              editingData={editingData}
              handleChange={handleChange}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 text-center text-sm text-gray-500 rounded-b-2xl border-t">
        Mã người dùng: <span className="font-mono text-xs bg-gray-200 p-1 rounded-md select-all">{userData.id}</span>
      </div>

    </div>
  );
};

export default ProfilePage;