import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const Header = () => {
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribing(true);
    try {
      const response = await apiService.subscribe(email);
      toast.success(response.message || 'Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <div className='py-5 px-5 md:px-12 lg:px-28'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl sm:text-4xl font-bold italic text-black'>Aiblog</h1>
        <div className='flex items-center gap-4'>
          {localStorage.getItem('token') ? (
            <Link to='/admin/dashboard'>
              <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>
                Dashboard <img src={assets.arrow} alt="arrow" />
              </button>
            </Link>
          ) : (
            <Link to='/admin'>
              <button className='flex items-center gap-2 font-medium py-1 px-3 sm:py-3 sm:px-6 border border-solid border-black shadow-[-7px_7px_0px_#000000]'>
                Get started <img src={assets.arrow} alt="arrow" />
              </button>
            </Link>
          )}
        </div>
      </div>

      <div className='text-center my-8'>
        <h1 className='text-3xl sm:text-5xl font-medium'>Welcome to Aiblog</h1>
        <p className='mt-10 max-w-[740px] m-auto text-xs sm:text-base'>Discover the latest news, tutorials, and insights on Artificial Intelligence. Subscribe to our newsletter to stay updated with the rapidly evolving world of AI.</p>
        <form onSubmit={handleSubscribe} className='flex justify-between max-w-[500px] scale-75 sm:scale-100 mx-auto mt-10 border border-black shadow-[-7px_7px_0px_#000000]'>
          <input
            type="email"
            placeholder='Enter your email'
            className='pl-4 outline-none flex-1'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribing}
            required
          />
          <button
            type="submit"
            className='border-l border-black py-4 px-4 sm:px-8 active:bg-gray-600 active:text-white disabled:bg-gray-300'
            disabled={subscribing}
          >
            {subscribing ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Header;
