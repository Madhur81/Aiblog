import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { apiService } from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Login = ({ setToken }) => {
  const [state, setState] = useState('Login');
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (state === 'Login') {
        const response = await apiService.login(data);
        if (response.token) {
          setToken(response.token);
          localStorage.setItem('token', response.token);
          window.dispatchEvent(new Event('auth-change'));
          navigate('/admin/dashboard');
        }
      } else {
        const response = await apiService.register(data);
        if (response.token) {
          setToken(response.token);
          localStorage.setItem('token', response.token);
          window.dispatchEvent(new Event('auth-change'));
          navigate('/admin/dashboard');
        }
      }
    } catch (error) {
      alert(error.response?.data?.message || error.message);
    }
  }

  return (
    <div className='min-h-screen grid place-items-center relative'>
      <Link to='/' className='absolute top-5 left-5'>
        <h1 className='text-3xl font-bold italic text-white'>Aiblog</h1>
      </Link>
      <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 m-auto items-start p-8 shadow-[0_3px_10px_rgb(0,0,0,0.2)] rounded-lg min-w-[340px]'>
        <h2 className='text-3xl font-semibold m-auto'>{state}</h2>
        <div className='flex flex-col gap-3 w-full'>
          {state === 'Sign Up' && <input name='name' onChange={onChangeHandler} value={data.name} className='outline-none border border-[#c5c5c5] p-2 rounded-md' type="text" placeholder='Full Name' required />}
          <input name='email' onChange={onChangeHandler} value={data.email} className='outline-none border border-[#c5c5c5] p-2 rounded-md' type="email" placeholder='Email Address' required />
          <input name='password' onChange={onChangeHandler} value={data.password} className='outline-none border border-[#c5c5c5] p-2 rounded-md' type="password" placeholder='Password' required />
        </div>
        <button type='submit' className='w-full bg-black text-white p-2 rounded-md font-medium text-base'>{state === 'Sign Up' ? "Create account" : "Login"}</button>
        {state === 'Sign Up'
          ? <p className='text-sm text-gray-500'>Already have an account? <span onClick={() => setState('Login')} className='text-blue-600 underline cursor-pointer font-medium'>Login here</span></p>
          : <p className='text-sm text-gray-500'>Create a new account? <span onClick={() => setState('Sign Up')} className='text-blue-600 underline cursor-pointer font-medium'>Click here</span></p>
        }
      </form>
    </div>
  )
}
// Add missing import for Link if not present


export default Login;
