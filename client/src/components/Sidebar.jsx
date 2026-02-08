import React from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='flex flex-col bg-slate-100'>
      <div className='px-2 sm:pl-14 py-3 border border-black'>
        <Link to='/'>
          <h1 className='text-2xl font-bold italic'>Aiblog</h1>
        </Link>
      </div>
      <div className='w-28 sm:w-80 h-[100vh] relative py-12 border border-black'>
        <div className="flex flex-col gap-4 pt-6">
          <NavLink to="/admin/dashboard" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.blog_icon} alt="" />
            <p>Dashboard</p>
          </NavLink>
          <NavLink to="/admin/list" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.blog_icon} alt="" />
            <p>Blog list</p>
          </NavLink>
          <NavLink to="/admin/add" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.add_icon} alt="" />
            <p>Add blog</p>
          </NavLink>
          <NavLink to="/admin/comments" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.email_icon} alt="" />
            <p>Comments</p>
          </NavLink>
          <NavLink to="/admin/subscriptions" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.email_icon} alt="" />
            <p>Subscriptions</p>
          </NavLink>
          <NavLink to="/admin/profile" className={({ isActive }) => `flex items-center border border-black gap-3 font-medium px-3 py-2 shadow-[-4px_4px_0px_#000000] ${isActive ? 'bg-[#ffeb00]' : 'bg-white'}`}>
            <img src={assets.user_icon || assets.add_icon} alt="" className='w-[28px]' />
            <p>Profile</p>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default Sidebar;
