import React, { useState, useEffect } from 'react';
import { User, LogOut, Trash2 } from 'lucide-react';
// Lưu ý: Tailwind CSS được tải trong môi trường ngoài, không cần thẻ script ở đây.

// --- Giả lập API ---
// *LƯU Ý: Mật khẩu được thêm vào initialUsers để khớp với logic mockApiCall.*
const initialUsers = [
    { id: 'u1', name: 'Admin User', email: 'admin@test.com', password: '123', role: 'Admin' },
    
];

let globalUsers = [...initialUsers];

// Giả lập hàm API call
const mockApiCall = async (endpoint, data) => {
    // Thêm độ trễ để mô phỏng tải
    await new Promise(resolve => setTimeout(resolve, 500)); 

    if (endpoint.includes('login')) {
        const user = globalUsers.find(u => u.email === data.email && u.password === data.password);
        if (user) {
            // Loại bỏ mật khẩu trước khi trả về
            const safeUser = { ...user };
            delete safeUser.password;
            return { token: 'fake-jwt-' + user.id, user: safeUser };
        } else {
            throw new Error("Thông tin đăng nhập không hợp lệ.");
        }
    }

    if (endpoint.includes('signup')) {
        const existingUser = globalUsers.find(u => u.email === data.email);
        if (existingUser) {
            throw new Error("Email đã tồn tại. Vui lòng đăng nhập.");
        }
        
        // Thêm người dùng mới
        const newUser = { 
            id: 'u' + (globalUsers.length + 1), 
            name: data.name, 
            email: data.email, 
            password: data.password, 
            role: 'User' 
        };
        globalUsers.push(newUser);
        return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
    }
};

// --- Component AuthPage (Đăng nhập/Đăng ký) ---
const AuthPage = ({ onAuthSuccess, onSignupSuccess, authMessage }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Chuyển đổi giữa Đăng nhập và Đăng ký
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

        // Validation cơ bản
        if (!email || !password || (!isLoginMode && (!name || !confirmPassword))) {
            setError("Vui lòng điền đầy đủ tất cả các trường!");
            return;
        }
        if (!isLoginMode && password !== confirmPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }

        setIsLoading(true);

        const endpoint = isLoginMode ? '/api/auth/login' : '/api/auth/signup';
        const data = isLoginMode ? { email, password } : { name, email, password };
        
        try {
            const result = await mockApiCall(endpoint, data);
            
            if (isLoginMode) {
                onAuthSuccess(result.user, result.token);
            } else {
                onSignupSuccess(result.message);
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

                {/* Hiển thị thông báo LỖI hoặc THÀNH CÔNG */}
                {error && (
                    <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-200 mb-4">
                        {error}
                    </div>
                )}
                {/* authMessage từ App component, hiển thị sau khi đăng ký thành công */}
                {authMessage && (
                    <div className="p-3 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-200 mb-4">
                        {authMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLoginMode && (
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
                    )}
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                            placeholder="vd: tngoc5617@gmail.com (hoặc admin@test.com)"
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
                            placeholder="Nhập mật khẩu (vd: 123)"
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

// --- Component Dashboard (Hiển thị Danh sách Người dùng) ---
const Dashboard = ({ user, handleLogout }) => {
    // Luôn lấy dữ liệu mới nhất từ biến toàn cục
    const [users, setUsers] = useState(globalUsers);
    
    // Kiểm tra quyền Admin
    const isAdmin = user.role === 'Admin';

    // Giả lập chức năng xóa người dùng
    const handleDelete = (id) => {
        // Kiểm tra quyền (Front-end validation)
        if (!isAdmin) {
            console.error("Lỗi: Người dùng không có quyền quản trị để xóa.");
            return;
        }

        const targetUser = globalUsers.find(u => u.id === id);
        if (targetUser.role === 'Admin') {
            console.error("Lỗi: Không thể xóa tài khoản Quản trị viên.");
            return;
        }
        if (user.id === id) {
            console.error("Lỗi: Không thể tự xóa tài khoản của mình.");
            return;
        }

        // Thực hiện xóa (trong môi trường mock)
        globalUsers = globalUsers.filter(u => u.id !== id);
        setUsers(globalUsers);
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 p-6 bg-white shadow-2xl rounded-xl">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-blue-700 flex items-center">
                    <User className="w-6 h-6 mr-2 text-blue-500"/>
                    Xin chào, {user.name}! 
                    
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150 shadow-xl flex items-center"
                >
                    <LogOut className="w-4 h-4 mr-1"/>
                    Đăng Xuất
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-100 pb-2">Danh sách người dùng hệ thống ({users.length})</h2>
            
            <div className="overflow-x-auto bg-gray-50 rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-blue-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Tên</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Vai trò</th>
                            {/* Cột Hành động chỉ hiển thị cho Admin */}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        u.role === 'Admin' ? 'bg-sky-100 text-sky-800' : 'bg-emerald-100 text-emerald-800'
                                    }`}>
                                        {u.role}
                                    </span>
                                </td>
                                {/* Nút Hành động chỉ hiển thị cho Admin */}
                                {isAdmin && (
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button 
                                            onClick={() => handleDelete(u.id)}
                                            className="text-red-600 hover:text-red-800 transition duration-150 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center ml-auto"
                                            disabled={u.id === user.id || u.role === 'Admin'} 
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
            
            <p className="mt-4 text-sm text-gray-500 italic">
                Lưu ý: Danh sách này là dữ liệu giả lập. Đăng nhập bằng email **admin@test.com** (mật khẩu **123**) để có quyền quản trị. Bạn cũng có thể đăng ký tài khoản mới.
            </p>
        </div>
    );
};

// --- Component App chính (Điều hướng) ---
const App = () => {
    // State để theo dõi người dùng đã đăng nhập hay chưa và thông tin người dùng
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [authMessage, setAuthMessage] = useState(null); // Thông báo Đăng ký/Đăng xuất thành công
    const [isAuthReady, setIsAuthReady] = useState(false); // Dùng để kiểm tra trạng thái ban đầu

    // 1. LOGIC KIỂM TRA XÁC THỰC TỪ LOCALSTORAGE (CHẠY LẦN ĐẦU)
    useEffect(() => {
        const storedToken = localStorage.getItem('userToken');
        const storedUser = localStorage.getItem('currentUser'); // Lấy JSON string

        if (storedToken && storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setCurrentUser(user);
                setIsAuthenticated(true);
            } catch (e) {
                console.error("Lỗi khi khôi phục thông tin người dùng:", e);
                localStorage.removeItem('userToken');
                localStorage.removeItem('currentUser');
            }
        }
        setIsAuthReady(true); // Đánh dấu đã hoàn thành kiểm tra
    }, []);

    // Hàm được gọi khi Đăng nhập thành công
    const handleAuthSuccess = (user, token) => {
        setCurrentUser(user);
        localStorage.setItem('userToken', token);
        localStorage.setItem('currentUser', JSON.stringify(user)); // Lưu thông tin người dùng
        setIsAuthenticated(true);
        setAuthMessage(null); // Xóa mọi thông báo cũ
    };
    
    // Hàm được gọi khi Đăng ký thành công
    const handleSignupSuccess = (message) => {
        setAuthMessage(message);
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        setIsAuthenticated(false);
        // Có thể thêm thông báo đăng xuất thành công nếu cần, nhưng tôi để nó đơn giản
    };

    // Màn hình loading ban đầu
    if (!isAuthReady) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="text-xl font-semibold text-blue-600">Đang tải...</div>
            </div>
        );
    }

    // Nếu đã xác thực, hiển thị Dashboard
    if (isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-100 p-4">
                <Dashboard user={currentUser} handleLogout={handleLogout} />
            </div>
        );
    }

    // Nếu chưa xác thực, hiển thị trang Đăng nhập/Đăng ký
    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center">
            <AuthPage 
                onAuthSuccess={handleAuthSuccess} 
                onSignupSuccess={handleSignupSuccess}
                authMessage={authMessage} // Truyền thông báo Đăng ký/Đăng xuất thành công xuống AuthPage
            />
        </div>
    );
};

export default App;