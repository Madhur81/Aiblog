import React, { useState } from 'react'
import { assets, blogCategories } from '../../assets/assets'
import { toast } from 'react-toastify';
import { apiService } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    title: "",
    description: "",
    category: "Startup",
    author: "Admin",
    authorImg: "/author_img.png"
  })
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState('professional');
  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  }

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setAiLoading(true);
    try {
      // Generate title if empty
      if (!data.title) {
        const titleResponse = await apiService.generateTitle(aiTopic);
        if (titleResponse.titles && titleResponse.titles.length > 0) {
          setData(prev => ({ ...prev, title: titleResponse.titles[0] }));
        }
      }

      // Generate content
      const contentResponse = await apiService.generateContent(
        data.title || aiTopic,
        [],
        aiTone
      );

      setData(prev => ({ ...prev, description: contentResponse.content }));

      // Suggest category
      const categoryResponse = await apiService.suggestCategory(
        contentResponse.content,
        blogCategories
      );

      if (categoryResponse.category) {
        setData(prev => ({ ...prev, category: categoryResponse.category }));
      }

      toast.success('Content generated successfully!');
      setShowAiModal(false);
      setAiTopic('');
    } catch (error) {
      console.error('AI generation error:', error);
      toast.error(`AI generation failed: ${error.response?.data?.message || error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const handleImproveContent = async () => {
    if (!data.description) {
      toast.error('No content to improve');
      return;
    }

    setAiLoading(true);
    try {
      const response = await apiService.improveContent(data.description);
      setData(prev => ({ ...prev, description: response.content }));
      toast.success('Content improved!');
    } catch (error) {
      console.error('Content improvement error:', error);
      toast.error(`Failed to improve content: ${error.response?.data?.message || error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = null;

      // Try to upload image if selected (skip if ImageKit is disabled)
      if (image) {
        try {
          imageUrl = await apiService.uploadImage(image);
        } catch (uploadError) {
          console.log('Image upload skipped:', uploadError.message);
          // Continue without image - don't block post creation
        }
      }

      const postData = {
        title: data.title,
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
        body: data.description,
        excerpt: data.description.substring(0, 150),
        // authorId handled by backend
        categories: [data.category],
        status: 'published',
        publishedAt: new Date()
      };

      // Only add featureImageUrl if image was uploaded
      if (imageUrl) {
        postData.featureImageUrl = imageUrl;
      }

      await apiService.createPost(postData);
      toast.success("Post Created Successfully!");

      // Reset form
      setData({
        title: "",
        description: "",
        category: "Startup",
        author: "Admin",
        authorImg: "/author_img.png"
      });
      setImage(false);

      // Force full page reload to ensure list updates
      window.location.href = '/admin/list';
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);
      toast.error(`Error creating post: ${error.response?.data?.message || error.message}`);
    }
  }

  return (
    <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16'>
      {/* AI Modal */}
      {showAiModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white p-8 rounded-lg max-w-md w-full'>
            <h2 className='text-2xl font-bold mb-4'>✨ Generate with AI</h2>

            <div className='mb-4'>
              <label className='block text-sm font-medium mb-2'>Topic or Keywords</label>
              <input
                type='text'
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                className='w-full px-4 py-2 border rounded'
                placeholder='e.g., Future of AI technology'
                disabled={aiLoading}
              />
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium mb-2'>Tone</label>
              <select
                value={aiTone}
                onChange={(e) => setAiTone(e.target.value)}
                className='w-full px-4 py-2 border rounded'
                disabled={aiLoading}
              >
                <option value='professional'>Professional</option>
                <option value='casual'>Casual</option>
                <option value='technical'>Technical</option>
                <option value='friendly'>Friendly</option>
              </select>
            </div>

            <div className='flex gap-3'>
              <button
                onClick={handleGenerateWithAI}
                disabled={aiLoading}
                className='flex-1 bg-black text-white py-2 px-4 rounded hover:bg-gray-800 disabled:bg-gray-400'
              >
                {aiLoading ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => {
                  setShowAiModal(false);
                  setAiTopic('');
                }}
                disabled={aiLoading}
                className='flex-1 border border-black py-2 px-4 rounded hover:bg-gray-100 disabled:bg-gray-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 min-h-[80vh]'>
        {/* AI Buttons */}
        <div className='flex gap-3 mb-4'>
          <button
            type='button'
            onClick={() => setShowAiModal(true)}
            className='flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-md'
          >
            ✨ Generate with AI
          </button>
          {data.description && (
            <button
              type='button'
              onClick={handleImproveContent}
              disabled={aiLoading}
              className='flex items-center gap-2 border border-purple-600 text-purple-600 py-2 px-6 rounded-lg hover:bg-purple-50 transition-all disabled:opacity-50'
            >
              🚀 Improve Content
            </button>
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Upload thumbnail</p>
          <label htmlFor="image">
            <img className='mt-4 max-w-[140px]' src={!image ? assets.upload_area : URL.createObjectURL(image)} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Blog Title</p>
          <input name='title' onChange={onChangeHandler} value={data.title} className='w-full sm:w-[500px] mt-4 px-4 py-3 border' type="text" placeholder='Type here' required />
        </div>
        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Blog Description</p>
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
        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Blog Category</p>
          <select name="category" onChange={onChangeHandler} value={data.category} className='w-40 mt-4 px-4 py-3 border text-gray-500'>
            {blogCategories.map((cat, idx) => <option key={idx} value={cat}>{cat}</option>)}
          </select>
        </div>
        <br />
        <button type="submit" className='mt-8 w-40 h-10 bg-black text-white'>ADD</button>
      </form>
    </div>
  )
}

export default Add;
