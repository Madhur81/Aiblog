import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import Comments from '../components/Comments';
import { apiService } from '../services/api';

// Gradient backgrounds for posts without images
const gradients = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];

const getGradient = (id) => {
  const index = id ? id.charCodeAt(id.length - 1) % gradients.length : 0;
  return gradients[index];
};

const PostPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const post = await apiService.getPost(id);
      setData(post);

      // Fetch related posts
      if (post.categories && post.categories.length > 0) {
        const related = await apiService.getPosts({ category: post.categories[0], limit: 5 });
        // Filter out current post and limit to 4
        setRelatedPosts(related.posts.filter(p => p._id !== id).slice(0, 4));
      }
    } catch (error) {
      console.error("Failed to fetch post", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-xl'>Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-xl'>Post not found</div>
      </div>
    );
  }

  // Use correct field names from database
  const postImage = data.featureImageUrl || data.image;
  const postContent = data.body || data.description || '';
  const postAuthor = data.authorId?.name || 'Unknown Author';
  const postCategory = data.categories?.[0] || 'General';
  const authorImage = data.authorId?.profileImg || assets.user_icon;

  return (
    <>
      <div className='bg-gray-200 py-5 px-5 md:px-12 lg:px-28'>
        <Navbar />
        <div className='text-center my-24'>
          <p className='inline-block px-3 py-1 bg-black text-white text-sm mb-4'>{postCategory}</p>
          <h1 className='text-2xl sm:text-5xl font-semibold max-w-[700px] mx-auto'>{data.title}</h1>
          <img className='mt-12 w-[100px] h-[100px] border border-white rounded-full mx-auto object-cover' src={authorImage} alt="" />
          <p className='mt-1 pb-2 text-lg max-w-[740px] mx-auto font-medium'>{postAuthor}</p>
          <p className='text-sm text-gray-600'>{new Date(data.publishedAt || data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <div className='mx-5 max-w-[800px] md:mx-auto mt-[-100px] mb-10'>
        {postImage ? (
          <img className='border-4 border-white w-full rounded-lg' src={postImage} alt={data.title} />
        ) : (
          <div
            className='border-4 border-white w-full h-[400px] rounded-lg flex items-center justify-center'
            style={{ background: getGradient(id) }}
          >
            <span className='text-white text-6xl font-bold opacity-50'>
              {data.title ? data.title.charAt(0).toUpperCase() : 'A'}
            </span>
          </div>
        )}

        {/* Post Content */}
        <div className='blog-content mt-10 prose prose-lg max-w-none'>
          <div dangerouslySetInnerHTML={{ __html: postContent }}></div>
        </div>

        {/* Tags */}
        {data.tags && data.tags.length > 0 && (
          <div className='mt-8 flex flex-wrap gap-2'>
            {data.tags.map((tag, index) => (
              <span key={index} className='px-3 py-1 bg-gray-200 rounded-full text-sm'>{tag}</span>
            ))}
          </div>
        )}

        {/* Social Share */}
        <div className='my-16'>
          <p className='text-black font font-semibold my-4'>Share this article on social media</p>
          <div className='flex'>
            <img src={assets.facebook_icon} className='w-[40px] pl-2 cursor-pointer' alt="" />
            <img src={assets.twitter_icon} className='w-[40px] pl-2 cursor-pointer' alt="" />
            <img src={assets.googleplus_icon} className='w-[40px] pl-2 cursor-pointer' alt="" />
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className='my-16 border-t pt-10'>
            <h3 className='text-2xl font-bold mb-8'>Related Posts</h3>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
              {relatedPosts.map(post => (
                <div key={post._id} className='cursor-pointer group' onClick={() => window.location.href = `/posts/${post._id}`}>
                  <div className='overflow-hidden rounded-lg mb-4 h-[200px]'>
                    {post.featureImageUrl ? (
                      <img src={post.featureImageUrl} alt="" className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500' />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-white text-4xl font-bold' style={{ background: getGradient(post._id) }}>
                        {post.title.charAt(0)}
                      </div>
                    )}
                  </div>
                  <p className='text-sm text-gray-500 mb-2'>{new Date(post.publishedAt || post.createdAt).toLocaleDateString()}</p>
                  <h4 className='text-xl font-bold group-hover:text-blue-600 transition-colors'>{post.title}</h4>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Comments postId={id} />
      <Footer />
    </>
  )
}

export default PostPage;
