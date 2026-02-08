import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';

const CommentModeration = () => {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    fetchComments();
  }, [filter]);

  const fetchComments = async (page = 1) => {
    try {
      setLoading(true);
      const params = { status: filter, page, limit: 20 };
      const data = await apiService.getAllComments(params);
      setComments(data.comments);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await apiService.approveComment(id);
      toast.success('Comment approved');
      fetchComments();
    } catch (error) {
      console.error('Error approving comment:', error);
      toast.error('Failed to approve comment');
    }
  };

  const handleReject = async (id) => {
    try {
      await apiService.rejectComment(id);
      toast.success('Comment rejected');
      fetchComments();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      toast.error('Failed to reject comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await apiService.deleteComment(id);
      toast.success('Comment deleted');
      fetchComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16">
      <h1 className="text-2xl font-bold mb-6">Comment Moderation</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        {['pending', 'approved', 'rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`pb-2 px-4 capitalize ${filter === status
              ? 'border-b-2 border-black font-semibold'
              : 'text-gray-500 hover:text-black'
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading comments...</div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm">
          <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
          </svg>
          <p className="text-lg font-medium">No {filter} comments found</p>
          <p className="text-sm">New comments will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold">{comment.authorName}</p>
                      <p className="text-sm text-gray-500">{comment.authorEmail}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 ml-13 mb-2">{comment.content}</p>

                  {comment.postId && (
                    <p className="text-sm text-gray-500 ml-13">
                      On post: <a href={`/posts/${comment.postId._id}`} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        {comment.postId.title}
                      </a>
                    </p>
                  )}

                  <p className="text-xs text-gray-400 ml-13 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>

                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(comment.status)}`}>
                  {comment.status}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {comment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleApprove(comment._id)}
                      className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(comment._id)}
                      className="bg-yellow-600 text-white px-4 py-1.5 rounded text-sm hover:bg-yellow-700 transition-colors"
                    >
                      Reject
                    </button>
                  </>
                )}
                {comment.status === 'approved' && (
                  <button
                    onClick={() => handleReject(comment._id)}
                    className="bg-yellow-600 text-white px-4 py-1.5 rounded text-sm hover:bg-yellow-700 transition-colors"
                  >
                    Reject
                  </button>
                )}
                {comment.status === 'rejected' && (
                  <button
                    onClick={() => handleApprove(comment._id)}
                    className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700 transition-colors"
                  >
                    Approve
                  </button>
                )}
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchComments(page)}
              className={`px-4 py-2 rounded ${pagination.page === page
                ? 'bg-black text-white'
                : 'bg-gray-200 hover:bg-gray-300'
                }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentModeration;
