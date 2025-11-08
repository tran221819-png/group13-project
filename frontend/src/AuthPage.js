import React, { useState } from 'react';

// Nhận handleSignup và handleLogin là các props được truyền từ App.js
function AuthPage({ 
    handleSignup, 
    handleLogin, 
    handleLogout, 
    loginLoading, 
    loginError, 
    isAuthenticated, 
    handleLoginErrorReset 
}) { 
    
    // State cục bộ để chuyển đổi giữa Đăng nhập (true) và Đăng ký (false)
    const [isLogin, setIsLogin] = useState(true); 
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    
    // State cho thông báo lỗi/thành công Đăng ký
    const [registerStatus, setRegisterStatus] = useState({ error: null, success: null });
    const [isRegistering, setIsRegistering] = useState(false);

    // Chức năng: Xử lý logic ĐĂNG KÝ (validation cục bộ)
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        setRegisterStatus({ error: null, success: null });

        if (password !== confirmPassword) {
            setRegisterStatus({ error: "Mật khẩu xác nhận không khớp.", success: null });
            return;
        }
        
        if (password.length < 6) {
             setRegisterStatus({ error: "Mật khẩu phải có ít nhất 6 ký tự.", success: null });
             return;
        }

        setIsRegistering(true);
        try {
            // GỌI HÀM handleSignup (PROP TỪ APP.JS)
            const token = await handleSignup(name, email, password);
            
            if (!token) {
                // Lỗi đăng ký (nếu không tự động đăng nhập)
                setRegisterStatus({ 
                    error: loginError || "Đăng ký thất bại. Vui lòng kiểm tra email đã tồn tại.", 
                    success: null 
                });
            } else {
                // Đăng ký thành công và tự động đăng nhập
                setRegisterStatus({ 
                    error: null, 
                    success: "Đăng ký thành công! Đang chuyển hướng..."
                });
            }
        } catch (err) {
            setRegisterStatus({ error: loginError || "Đăng ký thất bại. Vui lòng thử lại.", success: null });
        } finally {
            setIsRegistering(false);
        }
    };

    // Xử lý SUBMIT chung
    const handleSubmit = (e) => {
        e.preventDefault();
        // Xóa lỗi đăng ký cũ
        setRegisterStatus({ error: null, success: null });
        if (typeof handleLoginErrorReset === 'function') { handleLoginErrorReset(); } // Reset lỗi đăng nhập

        if (isLogin) {
            // Gọi hàm xử lý Đăng nhập được truyền từ App.js
            handleLogin(email, password); // Truyền email và password
        } else {
            handleSignUpSubmit(e); // Gọi hàm submit Đăng ký cục bộ
        }
    };

    // Nếu đã đăng nhập, hiển thị nút Đăng xuất
    if (isAuthenticated) {
        return (
            <div className="p-8 max-w-lg mx-auto mt-20 bg-white shadow-xl rounded-xl">
                <p className="text-center text-xl text-gray-700 mb-6">
                    Chào mừng! Bạn đã đăng nhập thành công.
                </p>
                <button 
                    onClick={handleLogout}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-200 shadow-md"
                >
                    Đăng xuất
                </button>
            </div>
        );
    }


    return (
        // Container chính: căn giữa (mx-auto), độ rộng tối đa (max-w-md), tạo bóng (shadow-2xl)
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-2xl rounded-xl border border-gray-100">
            <h2 className="text-3xl font-extrabold text-center mb-6 text-gray-800">
                {isLogin ? 'Đăng Nhập (Login)' : 'Đăng Ký (Sign Up)'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                {/* Tên (Chỉ khi Đăng ký) */}
                {!isLogin && (
                    <input 
                        type="text" 
                        placeholder="Họ và Tên" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                        // Các trường form được thiết kế toàn chiều rộng, có padding và bo góc
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    />
                )}

                {/* Email */}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                
                {/* Mật khẩu */}
                <input 
                    type="password" 
                    placeholder="Mật khẩu" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    minLength={6} 
                    className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />

                {/* Xác nhận Mật khẩu (Chỉ khi Đăng ký) */}
                {!isLogin && (
                    <input 
                        type="password" 
                        placeholder="Xác nhận Mật khẩu" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        minLength={6} 
                        className="p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                    />
                )}

                {/* HIỂN THỊ LỖI / THÔNG BÁO */}
                {isLogin && loginError && <p className="text-sm text-red-700 bg-red-100 p-2 rounded-md text-center">{loginError}</p>}
                {!isLogin && registerStatus.error && <p className="text-sm text-red-700 bg-red-100 p-2 rounded-md text-center">{registerStatus.error}</p>}
                {!isLogin && registerStatus.success && <p className="text-sm text-green-700 bg-green-100 p-2 rounded-md text-center">{registerStatus.success}</p>}

                {/* Nút Submit */}
                <button 
                    type="submit" 
                    disabled={isLogin ? loginLoading : isRegistering}
                    className={`py-3 px-4 font-bold rounded-lg transition duration-300 shadow-md 
                        ${(isLogin ? loginLoading : isRegistering) 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`
                    }
                >
                    {isLogin 
                        ? (loginLoading ? 'Đang đăng nhập (Logging In)...' : 'Đăng Nhập (Login)')
                        : (isRegistering ? 'Đang đăng ký (Signing Up)...' : 'Đăng Ký (Sign Up)')
                    }
                </button>
            </form>
            
            {/* Chuyển đổi giữa Login/Register */}
            <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setRegisterStatus({ error: null, success: null });
                        // Reset form fields
                        setPassword('');
                        setConfirmPassword('');
                        setName('');
                        // Gọi hàm reset lỗi đăng nhập
                        if (typeof handleLoginErrorReset === 'function') { handleLoginErrorReset(); }
                    }}
                    className="font-bold text-indigo-600 hover:text-indigo-800 transition duration-150"
                >
                    {isLogin ? "Đăng ký (Sign Up) ngay!" : "Đăng nhập (Login)!"}
                </button>
            </p>
        </div>
    );
}

export default AuthPage;