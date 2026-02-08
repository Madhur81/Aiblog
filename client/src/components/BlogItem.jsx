import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

// Gradient backgrounds for posts without images
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
];

const getGradient = (id) => {
  const index = id ? id.charCodeAt(id.length - 1) % gradients.length : 0;
  return gradients[index];
};

const BlogItem = ({ title, description, category, image, id }) => {
  const safeDescription = description || '';

  return (
    <div className='max-w-[330px] sm:max-w-[300px] bg-white border border-black hover:shadow-[-7px_7px_0px_#000000] transition-shadow duration-300'>
      <Link to={`/posts/${id}`}>
        {image ? (
          <img
            src={image}
            alt={title || 'Blog post'}
            className='border-b border-black w-full h-[200px] object-cover'
          />
        ) : (
          <div
            className='border-b border-black w-full h-[200px] flex items-center justify-center'
            style={{ background: getGradient(id) }}
          >
            <span className='text-white text-4xl font-bold opacity-50'>
              {title ? title.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
        )}
      </Link>
      <p className='ml-5 mt-5 px-1 inline-block bg-black text-white text-sm'>{category || 'General'}</p>
      <div className="p-5">
        <h5 className='mb-2 text-lg font-medium tracking-tight text-gray-900 line-clamp-2 min-h-[56px]'>{title || 'Untitled'}</h5>
        <p className='mb-3 text-sm tracking-tight text-gray-700' dangerouslySetInnerHTML={{ __html: safeDescription.slice(0, 120) + (safeDescription.length > 120 ? '...' : '') }}></p>
        <Link to={`/posts/${id}`} className='inline-flex items-center py-2 font-semibold text-center hover:underline'>
          Read more <img src={assets.arrow} className='ml-2' alt="" width={12} />
        </Link>
      </div>
    </div>
  )
}

export default BlogItem;
