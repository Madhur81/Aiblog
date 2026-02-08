import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { apiService } from '../services/api';

const Navbar = () => {
  const [token, setToken] = React.useState(localStorage.getItem('token'));
  const [user, setUser] = React.useState(null);
  const [showDropdown, setShowDropdown] = React.useState(false);

  // Listen for token changes (logout/login)
  React.useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem('token'));
      fetchUser();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);

    // Initial fetch
    if (token) fetchUser();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
    };
  }, [token]);

  const fetchUser = async () => {
    if (!localStorage.getItem('token')) {
      setUser(null);
      return;
    }
    try {
      const userData = await apiService.getMe();
      setUser(userData);
    } catch (e) {
      console.error("Failed to fetch user for navbar icon");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event('auth-change'));
    window.location.href = '/';
  };

  return (
    <div className='flex justify-between items-center py-5'>
      <Link to='/'>
        <h1 className='text-3xl font-bold italic text-black'>Aiblog</h1>
      </Link>

      <div className='flex items-center gap-4'>
        {token ? (
          <div className='relative'>
            <img
              onClick={() => setShowDropdown(!showDropdown)}
              src={user?.profileImg || assets.user_icon}
              className='w-10 h-10 rounded-full cursor-pointer border border-gray-300 object-cover'
              alt="Profile"
            />
            {showDropdown && (
              <div className='absolute right-0 top-12 bg-white border border-gray-200 shadow-md rounded-md w-48 z-50 py-2'>
                <Link
                  to='/admin/dashboard'
                  className='block px-4 py-2 hover:bg-gray-100 text-gray-700'
                  onClick={() => setShowDropdown(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to='/admin/profile'
                  className='block px-4 py-2 hover:bg-gray-100 text-gray-700'
                  onClick={() => setShowDropdown(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className='block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600'
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to='/admin' className='flex items-center gap-2 border border-black px-4 py-1 rounded-full shadow-[-5px_5px_0px_#000000] hover:shadow-[-2px_2px_0px_#000000] transition-all'>
            Get started <img src={assets.arrow_icon} alt="" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
