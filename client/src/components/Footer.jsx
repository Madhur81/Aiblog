import React from 'react';
import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className='flex justify-around flex-col gap-2 sm:gap-0 sm:flex-row bg-black py-5 items-center'>
      <h1 className='text-2xl font-bold italic text-white'>Aiblog</h1>
      <p className='text-sm text-white'>Copyright 2024 © Aiblog. All Right Reserved.</p>
      <div className='flex gap-2'>
        <img src={assets.facebook_icon} alt="fb" width={40} />
        <img src={assets.twitter_icon} alt="twitter" width={40} />
        <img src={assets.googleplus_icon} alt="google" width={40} />
      </div>
    </div>
  )
}

export default Footer;
