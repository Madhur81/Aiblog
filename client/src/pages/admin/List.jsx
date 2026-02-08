import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const List = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchList = async () => {
    try {
      setLoading(true);
      // Pass mine=true to get only my posts (including drafts)
      const data = await apiService.getPosts({ mine: true });
      // Handle both old and new API responses
      const posts = data.posts || data;
      setList(Array.isArray(posts) ? posts : []);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setList([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchList();
  }, [])

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await apiService.deletePost(id);
        toast.success('Post deleted successfully');
        fetchList();
      } catch (error) {
        console.error('Error deleting post:', error);
        toast.error('Failed to delete post');
      }
    }
  };

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <p className='mb-2'>All Blogs List</p>

      {loading ? (
        <div className='text-center py-20'>Loading posts...</div>
      ) : list.length === 0 ? (
        <div className='text-center py-20'>
          <p className='text-gray-500 mb-4'>No posts found. Create your first post!</p>
          <button
            onClick={() => navigate('/admin/add')}
            className='bg-black text-white px-6 py-2 rounded hover:bg-gray-800'
          >
            Add New Post
          </button>
        </div>
      ) : (
        <div className='relative h-[80vh] overflow-x-auto mt-4 border border-gray-400 scrollbar-hide'>
          <table className='w-full text-sm text-gray-500'>
            <thead className='text-xs text-gray-700 text-left uppercase bg-gray-50'>
              <tr>
                <th scope='col' className='hidden sm:block px-6 py-3'>Author name</th>
                <th scope='col' className='px-6 py-3'>Blog Title</th>
                <th scope='col' className='px-6 py-3'>Date</th>
                <th scope='col' className='px-2 py-3'>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, index) => {
                return <tr key={index} className='bg-white border-b hover:bg-gray-50'>
                  <td className='hidden sm:block px-6 py-4'>
                    {item.authorImg ? <img src={item.authorImg} className='w-10' alt="" /> : <img src={assets.user_icon} className='w-10' alt="" />}
                    <p>{item.author || "Admin"}</p>
                  </td>
                  <td className='px-6 py-4'>
                    {item.title ? item.title : "No Title"}
                  </td>
                  <td className='px-6 py-4'>
                    {new Date(item.createdAt).toDateString()}
                  </td>
                  <td className='px-6 py-4 cursor-pointer'>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${item._id}`)}
                        className='text-blue-600 hover:text-blue-800 font-medium'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className='text-red-600 hover:text-red-800 font-medium'
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default List;
