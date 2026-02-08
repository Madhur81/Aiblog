import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import { toast } from 'react-toastify';

const Comments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    content: ''
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await apiService.getComments(postId);
      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.authorName || !formData.authorEmail || !formData.content) {
      toast.error('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    try {
      const response = await apiService.createComment(postId, formData);
      toast.success(response.message || 'Comment submitted! It will appear after approval.');
      setFormData({ authorName: '', authorEmail: '', content: '' });
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-8 text-center">Loading comments...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-5 md:px-12">
      <div className="border-t border-gray-300 pt-8">
        <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-6 mb-8">
            {comments.map((comment) => (
              <div key={comment._id} className="bg-gray-50 p-5 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {comment.authorName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{comment.authorName}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700 ml-13">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-8">No comments yet. Be the first to comment!</p>
        )}

        {/* Add Comment Button/Form */}
        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors"
          >
            Add a Comment
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Leave a Comment</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="authorName"
                  value={formData.authorName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="Your name"
                  required
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="authorEmail"
                  value={formData.authorEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                  placeholder="your@email.com"
                  required
                  disabled={submitting}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Comment *</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-black"
                placeholder="Share your thoughts..."
                required
                disabled={submitting}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-black text-white py-2 px-6 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Comment'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData({ authorName: '', authorEmail: '', content: '' });
                }}
                disabled={submitting}
                className="border border-black py-2 px-6 rounded hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-3">
              Your comment will be reviewed before being published.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Comments;
