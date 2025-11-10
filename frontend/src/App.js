import React, { useState, useEffect, useCallback } from 'react';
import { User, LogOut, Trash2, ArrowLeft, Save, Cake, Home } from 'lucide-react'; 

// ----------------------------------------------------------------------
// 🛠️ CẤU HÌNH API THỰC TẾ
// ----------------------------------------------------------------------

const BASE_API_URL = 'http://localhost:5000/api'; 

// --- Hàm gọi API thực tế ---
const apiCall = async (endpoint, data, method = 'GET', token = null) => {
    const url = `${BASE_API_URL}/${endpoint}`; 
    
    const headers = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`; 
    }

    const options = {
        method,
        headers,
        body: data && (method === 'POST' || method === 'PUT' || method === 'PATCH') 
            ? JSON.stringify(data) 
            : null, 
    };
    
    if (method === 'GET' || method === 'DELETE') {
        delete options.body;
    }

    const response = await fetch(url, options);
    
    const contentType = response.headers.get("content-type");
    let result = {};
    if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json().catch(() => ({ message: response.statusText }));
    } else {
        result = { message: response.statusText };
    }

    if (!response.ok) {
        const errorMessage = result.message || `Lỗi HTTP: ${response.status} (${response.statusText})`;
        throw new Error(errorMessage);
    }

    return result; 
};


const getCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const MAX_DATE = getCurrentDate(); 


// ----------------------------------------------------------------------
// ⚛️ COMPONENT AUTH PAGE (Đã sửa lỗi 400 Bad Request)
// ----------------------------------------------------------------------
const AuthPage = ({ onAuthSuccess, onSignupSuccess, authMessage }) => {
    // ... (Code AuthPage giữ nguyên như bản sửa đổi trước)
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setError(null);
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!email || !password || (!isLoginMode && (!name || !confirmPassword))) { 
            setError("Vui lòng điền đầy đủ tất cả các trường!");
            return;
        }
        if (!isLoginMode && password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }
        
        setIsLoading(true);

        const endpoint = isLoginMode ? 'auth/login' : 'auth/signup'; 
        const method = 'POST';
        
        // CHỈ GỬI name, email, password
        const data = isLoginMode ? 
            { email, password } : 
            { name, email, password }; 

        try {
            const result = await apiCall(endpoint, data, method);
            
            if (isLoginMode) {
                // Backend trả về user._id, ta dùng nó làm id ở frontend
                onAuthSuccess(result.user, result.token); 
            } else {
                onSignupSuccess(result.message || 'Đăng ký thành công!');
                setIsLoginMode(true);
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');
            }

        } catch (err) {
            const errorMessage = err.message || "Đã xảy ra lỗi. Vui lòng kiểm tra kết nối mạng hoặc thử lại.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const title = isLoginMode ? 'Đăng Nhập (Login)' : 'Đăng Ký (Sign Up)';
    const buttonText = isLoginMode ? 'Đăng Nhập' : 'Đăng Ký';
    const switchPrompt = isLoginMode ? 'Chưa có tài khoản?' : 'Đã có tài khoản?';
    const switchButtonText = isLoginMode ? 'Đăng ký ngay!' : 'Đăng nhập!';

    return (
        <div className="flex items-center justify-center w-full p-4">
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
                <h2 className="text-4xl font-extrabold text-blue-700 text-center mb-8">
                    {title}
                </h2>

                {error && (
                    <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-200 mb-4">
                        {error}
                    </div>
                )}
                {authMessage && (
                    <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-200 mb-4">
                        {authMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLoginMode && (
                        <>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Nhập tên của bạn"
                                    required={!isLoginMode}
                                    disabled={isLoading}
                                />
                            </div>
                        </>
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="vd: tngoc5617@gmail.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="Nhập mật khẩu"
                            required
                            disabled={isLoading}
                        />
                    </div>
                    
                    {!isLoginMode && (
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Xác nhận Mật khẩu</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="Nhập lại mật khẩu"
                                required={!isLoginMode}
                                disabled={isLoading}
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition duration-300 transform ${
                            isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {isLoginMode ? 'Đang Đăng Nhập...' : 'Đang Đăng Ký...'}
                            </span>
                        ) : (
                            buttonText
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 mb-2">
                        {switchPrompt}
                    </p>
                    <button
                        onClick={toggleMode}
                        className="text-blue-600 font-medium hover:text-blue-800 transition duration-150 p-2 rounded-md hover:bg-blue-50"
                        disabled={isLoading}
                    >
                        {switchButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

// ----------------------------------------------------------------------
// ⚛️ COMPONENT PROFILE PAGE (SỬ DỤNG /api/profile)
// ----------------------------------------------------------------------
const ProfilePage = ({ user, handleUpdateProfile, handleGoBack }) => {
    // Luôn đảm bảo giá trị khởi tạo là chuỗi rỗng
    const [name, setName] = useState(user.name || user.displayName || '');
    const [email, setEmail] = useState(user.email || '');
    const [dob, setDob] = useState(user.dob || ''); 
    const [hometown, setHometown] = useState(user.hometown || ''); 
    
    const [newPassword, setNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState(''); 
    const [isLoading, setIsLoading] = useState(false);
    
    const [formError, setFormError] = useState(null); 

    const apiCall = window.apiCall; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);
        
        // 1. Kiểm tra trường bắt buộc
        if (!name.trim() || !email.trim()) { // Dùng .trim() để loại bỏ khoảng trắng
            setFormError("Tên và Email không được để trống.");
            return;
        }

        if (newPassword && !currentPassword) {
            setFormError("Vui lòng cung cấp Mật khẩu hiện tại để đổi mật khẩu.");
            return;
        }
        
        if (newPassword && newPassword.length < 6) {
             setFormError("Mật khẩu mới phải có ít nhất 6 ký tự.");
             return;
        }

        setIsLoading(true);

        // 2. ⭐ ĐIỀU CHỈNH LOGIC GỬI DỮ LIỆU ĐỂ ĐẢM BẢO CHUỖI KHÔNG PHẢI NULL
        const data = {
            name: name.trim(), // Gửi chuỗi đã loại bỏ khoảng trắng
            displayName: name.trim(), 
            email: email.trim(), 
            // Đảm bảo dob và hometown là chuỗi rỗng nếu không có giá trị
            dob: dob || '', 
            hometown: hometown || '',
        };

        if (newPassword) {
             data.newPassword = newPassword;
             data.currentPassword = currentPassword;
        }
        
        const token = localStorage.getItem('userToken'); 

        try {
            if (!apiCall) throw new Error("API Call function not available.");

            const result = await apiCall('profile', data, 'PUT', token);
            
            const updatedUser = result.user || result; 

            // Cập nhật state (đảm bảo cập nhật đầy đủ các trường)
            handleUpdateProfile({
                ...user,
                name: updatedUser.displayName || updatedUser.name || name, 
                email: updatedUser.email || email,
                dob: updatedUser.dob || dob, // Cập nhật cả dob và hometown
                hometown: updatedUser.hometown || hometown,
            }); 
            
            setIsLoading(false); 
            handleGoBack(); 
            
        } catch (err) {
            // 3. ⭐ Cải thiện thông báo lỗi
            const serverMessage = err.message ? err.message : (err.status === 401 ? "Phiên làm việc hết hạn. Vui lòng đăng nhập lại." : "Đã xảy ra lỗi không xác định ở server.");
            const errorMessage = serverMessage || "Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.";
            
            // Nếu lỗi liên quan đến mật khẩu hiện tại, thông báo cụ thể
            if (errorMessage.includes("Mật khẩu hiện tại")) {
                 setFormError("Mật khẩu hiện tại không đúng hoặc không được cung cấp.");
            } else {
                 setFormError(errorMessage); 
            }
            
            setIsLoading(false);
        } 
    };
    
    return (
        <div className="max-w-xl mx-auto mt-8 p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-700 flex items-center">
                    <User className="w-6 h-6 mr-2 text-blue-500"/>
                    Chỉnh sửa Hồ sơ
                </h1>
                <button
                    onClick={handleGoBack}
                    className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition duration-150 shadow-xl flex items-center"
                    disabled={isLoading}
                >
                    <ArrowLeft className="w-4 h-4 mr-1"/> Quay lại
                </button>
            </div>
            
            {formError && (
                <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-200 mb-4">
                    {formError}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên người dùng</label>
                    <input
                        id="name"
                        type="text"
                        value={name} 
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Nhập tên mới"
                        required
                        disabled={isLoading}
                    />
                </div>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition bg-gray-50"
                        placeholder="Nhập email mới"
                        required
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Cake className="w-4 h-4 mr-1 text-pink-500"/> Ngày sinh 
                    </label>
                    <input
                        id="dob"
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        disabled={isLoading}
                        max={MAX_DATE} 
                    />
                </div>
                
                <div>
                    <label htmlFor="hometown" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <Home className="w-4 h-4 mr-1 text-green-500"/> Quê quán 
                    </label>
                    <input
                        id="hometown"
                        type="text"
                        value={hometown}
                        onChange={(e) => setHometown(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Nhập quê quán mới"
                        disabled={isLoading}
                    />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-800 pt-4 border-t border-gray-100">Đổi Mật khẩu (Không bắt buộc)</h3>
                
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu hiện tại</label>
                    <input
                        id="currentPassword"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Nhập mật khẩu hiện tại (nếu đổi mật khẩu)"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu mới (ít nhất 6 ký tự)</label>
                    <input
                        id="newPassword"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Để trống nếu không muốn đổi"
                        disabled={isLoading}
                    />
                </div>
                
                <button
                    type="submit"
                    className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition duration-300 transform flex items-center justify-center ${
                        isLoading 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50'
                    }`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Đang Lưu...
                        </span>
                    ) : (
                        <><Save className="w-5 h-5 mr-2" /> Lưu Thay Đổi</>
                    )}
                </button>
            </form>
        </div>
    );
};


// ----------------------------------------------------------------------
// ⚛️ COMPONENT DASHBOARD (Giữ nguyên)
// ----------------------------------------------------------------------
const Dashboard = ({ user, handleLogout, handleViewProfile, authMessage, clearAuthMessage }) => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const isAdmin = user.role === 'Admin'; 
    const token = localStorage.getItem('userToken');

    useEffect(() => {
        if (authMessage) {
            const timer = setTimeout(() => {
                clearAuthMessage();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [authMessage, clearAuthMessage]);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            // Vẫn gọi /api/users, nhưng lưu ý: API này dùng MẢNG TẠM, 
            // có thể không chứa user bạn vừa đăng nhập (MongoDB user).
            const result = await apiCall('users', null, 'GET', token); 
            
            setUsers(result); 
        } catch (error) {
            console.error("Không thể tải danh sách người dùng:", error.message);
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                handleLogout();
            }
        } finally {
            setIsLoading(false);
        }
    }, [token, handleLogout]);

    useEffect(() => {
        if (token) {
            fetchUsers();
        } else {
            setIsLoading(false);
        }
    }, [fetchUsers, token]); 

    const handleDelete = async (id) => {
        if (!isAdmin) {
            alert("Bạn không có quyền quản trị để xóa người dùng.");
            return;
        }
        
        if (id === user.id) {
             alert("Bạn không thể tự xóa tài khoản của mình.");
             return;
        }

        if (window.confirm(`Bạn có chắc chắn muốn xóa người dùng ID: ${id}?`)) {
            const token = localStorage.getItem('userToken');
            try {
                // API này có thể không hoạt động vì ID là CHUỖI MongoDB, 
                // nhưng userController.js chỉ tìm ID SỐ NGUYÊN.
                await apiCall(`users/${id}`, null, 'DELETE', token); 
                setUsers(prevUsers => prevUsers.filter(u => u.id !== id));
            } catch (error) {
                console.error("Xóa người dùng thất bại:", error.message);
                alert(`Xóa người dùng thất bại: ${error.message}`);
            }
        }
    };
    
    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-700 flex items-center">
                    <User className="w-6 h-6 mr-2 text-blue-500"/>
                    Xin chào, {user.name}! 
                </h1>
                <div className="flex space-x-3">
                    <button
                        onClick={handleViewProfile}
                        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-150 shadow-xl flex items-center"
                    >
                        <User className="w-4 h-4 mr-1"/> Xem/Chỉnh sửa Hồ sơ
                    </button>
                    <button
                        onClick={handleLogout} 
                        className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 shadow-xl flex items-center"
                    >
                        <LogOut className="w-4 h-4 mr-1"/>
                        Đăng Xuất
                    </button>
                </div>
            </div>
            
            {authMessage && (
                <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-200 mb-4">
                    {authMessage}
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Danh sách người dùng hệ thống ({users.length})</h2>
            
            {isLoading ? (
                <div className="text-center py-8">
                    <svg className="animate-spin h-8 w-8 text-blue-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-gray-500">Đang tải dữ liệu người dùng từ backend...</p>
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-blue-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Tên</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Ngày sinh</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Quê quán</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Vai trò</th>
                                {isAdmin && (
                                    <th className="px-6 py-3 text-right text-xs font-bold text-blue-700 uppercase tracking-wider">Hành động</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {users.map((u) => (
                                <tr key={u.id} className={u.id === user.id ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50 transition duration-100'}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.name} {u.id === user.id && '(Bạn)'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.dob || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.hometown || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            (u.role || 'User') === 'Admin' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {u.role || 'User'}
                                        </span>
                                    </td>
                                    {isAdmin && (
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button 
                                                onClick={() => handleDelete(u.id)}
                                                className="text-red-600 hover:text-red-800 transition duration-150 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center ml-auto"
                                                disabled={u.id === user.id} 
                                            >
                                                <Trash2 className="w-4 h-4 mr-1"/> Xóa
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
        </div>
    );
};


// ----------------------------------------------------------------------
// ⚛️ COMPONENT APP CHÍNH (Giữ nguyên)
// ----------------------------------------------------------------------
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [authMessage, setAuthMessage] = useState(null); 
    const [isAuthReady, setIsAuthReady] = useState(false); 
    const [view, setView] = useState('dashboard'); 

    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('currentUser'); 

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                const safeUser = { ...user, id: user.id || user._id }; 
                setCurrentUser(safeUser);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Lỗi khi khôi phục thông tin người dùng:", e);
                localStorage.removeItem('userToken');
                localStorage.removeItem('currentUser');
            }
        }
        setIsAuthReady(true); 
    }, []);

    const clearAuthMessage = useCallback(() => setAuthMessage(null), []);

    const handleAuthSuccess = (user, token) => {
        const safeUser = { ...user, id: user.id || user._id };
        setCurrentUser(safeUser);
        localStorage.setItem('userToken', token);
        localStorage.setItem('currentUser', JSON.stringify(safeUser)); 
        setIsAuthenticated(true);
        setView('dashboard'); 
        setAuthMessage(null); 
    };
    
    const handleSignupSuccess = (message) => {
        setAuthMessage(message);
    };

    const handleUpdateProfile = (updatedUser) => {
        const safeUser = { ...currentUser, ...updatedUser, id: updatedUser.id || updatedUser._id };
        setCurrentUser(safeUser);
        localStorage.setItem('currentUser', JSON.stringify(safeUser));
        setAuthMessage("Hồ sơ của bạn đã được cập nhật thành công!");
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setIsAuthenticated(false);
        setView('dashboard'); 
        setAuthMessage("Bạn đã đăng xuất thành công.");
    };

    const renderContent = () => {
        if (!isAuthReady) {
            return (
                <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                    <div className="text-xl font-semibold text-blue-600">Đang tải...</div>
                </div>
            );
        }

        if (!isAuthenticated || !currentUser) {
            return (
                <AuthPage 
                    onAuthSuccess={handleAuthSuccess} 
                    onSignupSuccess={handleSignupSuccess}
                    authMessage={authMessage} 
                />
            );
        }

        if (view === 'profile') {
            return (
                <ProfilePage
                    key={`profile-${currentUser.id}-${view}`} 
                    user={currentUser}
                    handleUpdateProfile={handleUpdateProfile}
                    handleGoBack={() => setView('dashboard')} 
                />
            );
        }
        
        return (
            <Dashboard 
                key={`dashboard-${currentUser.id}-${view}`}
                user={currentUser} 
                handleLogout={handleLogout} 
                handleViewProfile={() => setView('profile')} 
                authMessage={authMessage} 
                clearAuthMessage={clearAuthMessage}
            />
        );
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            {renderContent()}
        </div>
    );
};

export default App;