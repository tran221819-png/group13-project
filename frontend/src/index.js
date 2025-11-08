// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App'; // Import App.js đã chứa Router

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* Chỉ cần BrowserRouter ở ngoài cùng để App.js dùng được useNavigate */}
        <BrowserRouter> 
            <App />
        </BrowserRouter>
    </React.StrictMode>
);