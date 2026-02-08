import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        setError(error.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <p className='text-xl'>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
        <p className='text-xl text-red-600'>Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 bg-black text-white px-4 py-2 rounded'
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats: metrics, recentPosts, recentComments } = stats;

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10'>
        {/* Total Posts */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-white'>
          <div className='flex items-center justify-between mb-4'>
            <img src={assets.dashboard_icon_1} className='w-10' alt="" />
            <span className='text-3xl font-bold'>{metrics.posts.total}</span>
          </div>
          <h3 className='text-lg font-semibold'>Total Posts</h3>
          <p className='text-sm text-gray-600'>Published: {metrics.posts.published} | Drafts: {metrics.posts.draft}</p>
        </div>

        {/* Total Comments */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-white'>
          <div className='flex items-center justify-between mb-4'>
            <img src={assets.dashboard_icon_2} className='w-10' alt="" />
            <span className='text-3xl font-bold'>{metrics.comments.total}</span>
          </div>
          <h3 className='text-lg font-semibold'>Total Comments</h3>
          <p className='text-sm text-gray-600'>Pending: {metrics.comments.pending} | Approved: {metrics.comments.approved}</p>
        </div>

        {/* Subscribers */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-white'>
          <div className='flex items-center justify-between mb-4'>
            <img src={assets.dashboard_icon_3} className='w-10' alt="" />
            <span className='text-3xl font-bold'>{metrics.subscribers}</span>
          </div>
          <h3 className='text-lg font-semibold'>Subscribers</h3>
          <p className='text-sm text-gray-600'>Active newsletter subscribers</p>
        </div>

        {/* Quick Actions */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-gradient-to-br from-purple-600 to-blue-600 text-white'>
          <div className='flex items-center justify-between mb-4'>
            <img src={assets.dashboard_icon_4} className='w-10 filter brightness-0 invert' alt="" />
          </div>
          <h3 className='text-lg font-semibold mb-4'>Quick Actions</h3>
          <Link to="/admin/add" className='block bg-white text-black text-center py-2 rounded hover:bg-gray-200 transition'>
            New Post
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Posts */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-white'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Recent Posts</h2>
            <Link to="/admin/list" className='text-blue-600 hover:underline text-sm'>View All</Link>
          </div>
          <div className='space-y-3'>
            {recentPosts && recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <div key={post._id} className='flex justify-between items-start border-b pb-2'>
                  <div className='flex-1'>
                    <h3 className='font-medium text-sm line-clamp-1'>{post.title}</h3>
                    <p className='text-xs text-gray-500'>
                      {new Date(post.createdAt).toLocaleDateString()} • {post.categories?.[0] || 'Uncategorized'}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${post.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                    {post.status}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-sm'>No posts yet</p>
            )}
          </div>
        </div>

        {/* Recent Comments */}
        <div className='border border-black shadow-[-7px_7px_0px_#000000] p-6 bg-white'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold'>Recent Comments</h2>
            <Link to="/admin/comments" className='text-blue-600 hover:underline text-sm'>View All</Link>
          </div>
          <div className='space-y-3'>
            {recentComments && recentComments.length > 0 ? (
              recentComments.map((comment) => (
                <div key={comment._id} className='flex justify-between items-start border-b pb-2'>
                  <div className='flex-1'>
                    <h3 className='font-medium text-sm'>{comment.authorName}</h3>
                    <p className='text-xs text-gray-700 line-clamp-2'>{comment.content}</p>
                    <p className='text-xs text-gray-500 mt-1'>
                      on "{comment.postId?.title || 'Unknown Post'}"
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                    comment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                    {comment.status}
                  </span>
                </div>
              ))
            ) : (
              <p className='text-gray-500 text-sm'>No comments yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
