import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets, blogCategories } from '../../assets/assets';
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [data, setData] = useState({
    title: '',
    description: '',
    category: 'Startup',
    status: 'draft'
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await apiService.getPost(id);
        setData({
          title: post.title || '',
          description: post.body || post.description || '',
          category: post.categories?.[0] || 'Startup',
          status: post.status || 'draft'
        });
        setExistingImageUrl(post.featureImageUrl || '');
      } catch (error) {
        console.error('Error fetching post:', error);
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = existingImageUrl;

      // Upload new image if selected
      if (image) {
        try {
          imageUrl = await apiService.uploadImage(image);
        } catch (imgError) {
          console.warn('Image upload skipped:', imgError.message);
        }
      }

      const postData = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        body: data.description,
        excerpt: data.description.substring(0, 150),
        // authorId: '660c6d44f6c1f93f9c3f9c3f', // Removed hardcoded ID
        categories: [data.category],
        status: data.status,
        featureImageUrl: imageUrl,
        publishedAt: data.status === 'published' ? new Date() : null
      };

      await apiService.updatePost(id, postData);
      toast.success('Post Updated Successfully!');
      navigate('/admin/list');
    } catch (error) {
      console.error('Full error:', error);
      toast.error(`Error updating post: ${error.response?.data?.message || error.message}`);
    }
  };

  if (loading) {
    return <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 text-center">Loading...</div>;
  }

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <form onSubmit={onSubmitHandler} className="flex flex-col gap-3 min-h-[80vh]">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

        <div className="flex flex-col gap-2">
          <p className="text-xl">Upload thumbnail</p>
          <label htmlFor="image">
            <img
              className="mt-4 max-w-[140px] cursor-pointer border"
              src={image ? URL.createObjectURL(image) : (existingImageUrl || assets.upload_area)}
              alt=""
            />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
          {existingImageUrl && !image && (
            <p className="text-sm text-gray-500">Current image loaded</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl">Blog Title</p>
          <input
            name="title"
            onChange={onChangeHandler}
            value={data.title}
            className="w-full sm:w-[500px] mt-4 px-4 py-3 border"
            type="text"
            placeholder="Type here"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl">Blog Description</p>
          <textarea
            name='description'
            onChange={onChangeHandler}
            value={data.description}
            className='w-full mt-4 px-4 py-3 border'
            placeholder='Write your blog content here...'
            rows={15}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl">Blog Category</p>
          <select
            name="category"
            onChange={onChangeHandler}
            value={data.category}
            className="w-40 mt-4 px-4 py-3 border text-gray-500"
          >
            {blogCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl">Status</p>
          <select
            name="status"
            onChange={onChangeHandler}
            value={data.status}
            className="w-40 mt-4 px-4 py-3 border text-gray-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <br />
        <div className="flex gap-3">
          <button type="submit" className="mt-8 w-40 h-10 bg-black text-white hover:bg-gray-800">
            UPDATE
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/list')}
            className="mt-8 w-40 h-10 border border-black hover:bg-gray-100"
          >
            CANCEL
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
