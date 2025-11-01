import React, { useState } from 'react';
import axios from 'axios';

const AddUser = ({ onUserAdded, apiEndpoint }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !email) {
            alert('Vui lòng điền đầy đủ Tên và Email.');
            return;
        }

        setIsSubmitting(true);
        try {
            const newUser = { name, email };
            const response = await axios.post(apiEndpoint, newUser);
            
            // Gọi hàm từ App.js để cập nhật state danh sách
            onUserAdded(response.data); 
            
            // Reset form
            setName('');
            setEmail('');

        } catch (error) {
            console.error('Lỗi khi thêm người dùng:', error);
            alert('Thêm người dùng thất bại. Kiểm tra console.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #007bff', borderRadius: '5px' }}>
            <h2 style={{ color: '#007bff' }}>Thêm Người Dùng Mới</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="text"
                    placeholder="Tên"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isSubmitting}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '3px' }}
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '3px' }}
                />
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                </button>
            </form>
        </div>
    );
};

export default AddUser;
