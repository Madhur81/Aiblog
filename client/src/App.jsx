import React, { useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import Add from './pages/admin/Add';
import Edit from './pages/admin/Edit';
import List from './pages/admin/List';
import CommentModeration from './pages/admin/CommentModeration';
import Sidebar from './components/Sidebar';
import { assets } from './assets/assets';
import Profile from './pages/admin/Profile';

// Admin Layout Component
const AdminLayout = ({ children }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/admin';
  };

  return (
    <div className='flex items-start min-h-screen'>
      <Sidebar />
      <div className="flex flex-col w-full">
        <div className='flex items-center justify-between w-full py-2 max-h-[60px] px-12 border-b border-black relative'>
          <h3 className='font-medium'>Admin Panel</h3>
          <div className="relative">
            <img
              src={assets.user_icon}
              alt=""
              className='w-7 cursor-pointer'
              onClick={() => setShowDropdown(!showDropdown)}
            />
            {showDropdown && (
              <div className="absolute right-0 top-10 bg-white border border-gray-200 shadow-md rounded-md w-40 z-50">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => window.location.href = '/admin/profile'}>Profile</li>
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600" onClick={handleLogout}>Logout</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

const ProtectedRoute = ({ children, token }) => {
  if (!token) {
    return <Navigate to="/admin" />;
  }
  return <AdminLayout>{children}</AdminLayout>;
}

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/posts/:id' element={<PostPage />} />

        <Route path='/admin' element={token ? <Navigate to="/admin/dashboard" /> : <Login setToken={setToken} />} />

        <Route path='/admin/dashboard' element={<ProtectedRoute token={token}><Dashboard /></ProtectedRoute>} />
        <Route path='/admin/add' element={<ProtectedRoute token={token}><Add /></ProtectedRoute>} />
        <Route path='/admin/edit/:id' element={<ProtectedRoute token={token}><Edit /></ProtectedRoute>} />
        <Route path='/admin/list' element={<ProtectedRoute token={token}><List /></ProtectedRoute>} />


        <Route path='/admin/comments' element={<ProtectedRoute token={token}><CommentModeration /></ProtectedRoute>} />
        <Route path='/admin/subscriptions' element={<ProtectedRoute token={token}><div className='p-10'>Subscriptions (Mock)</div></ProtectedRoute>} />
        <Route path='/admin/profile' element={<ProtectedRoute token={token}><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App;
