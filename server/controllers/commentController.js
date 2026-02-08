const Comment = require('../models/Comment');
const Post = require('../models/Post');

const commentController = {
  // Get all approved comments for a specific post (Public)
  getPostComments: async (req, res) => {
    try {
      const { postId } = req.params;
      const comments = await Comment.find({
        postId,
        status: 'approved'
      }).sort({ createdAt: -1 });

      res.json(comments);
    } catch (error) {
      console.error('Error fetching post comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
  },

  // Create a new comment (Public)
  createComment: async (req, res) => {
    try {
      const { postId } = req.params;
      const { authorName, authorEmail, content } = req.body;

      // Validation
      if (!authorName || !authorEmail || !content) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Verify post exists
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      const newComment = new Comment({
        postId,
        authorName,
        authorEmail,
        content,
        status: 'pending'
      });

      const savedComment = await newComment.save();
      res.status(201).json({
        message: 'Comment submitted successfully. It will appear after approval.',
        comment: savedComment
      });
    } catch (error) {
      console.error('Error creating comment:', error);
      res.status(500).json({ message: 'Failed to create comment', error: error.message });
    }
  },

  // Get all comments with filtering (Admin only)
  getAllComments: async (req, res) => {
    try {
      const { status, page = 1, limit = 20 } = req.query;
      const query = {};

      if (status && ['pending', 'approved', 'rejected'].includes(status)) {
        query.status = status;
      }

      // Filter comments for posts authored by the current user UNLESS superadmin
      if (req.user.role !== 'superadmin') {
        const userPostIds = await Post.find({ authorId: req.user.id }).distinct('_id');
        query.postId = { $in: userPostIds };
      }

      const skip = (page - 1) * limit;
      const comments = await Comment.find(query)
        .populate('postId', 'title slug')
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(skip);

      const total = await Comment.countDocuments(query);

      res.json({
        comments,
        pagination: {
          total,
          page: parseInt(page),
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching all comments:', error);
      res.status(500).json({ message: 'Failed to fetch comments', error: error.message });
    }
  },

  // Approve a comment (Admin only)
  approveComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByIdAndUpdate(
        id,
        { status: 'approved' },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.json({ message: 'Comment approved', comment });
    } catch (error) {
      console.error('Error approving comment:', error);
      res.status(500).json({ message: 'Failed to approve comment', error: error.message });
    }
  },

  // Reject a comment (Admin only)
  rejectComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByIdAndUpdate(
        id,
        { status: 'rejected' },
        { new: true }
      );

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.json({ message: 'Comment rejected', comment });
    } catch (error) {
      console.error('Error rejecting comment:', error);
      res.status(500).json({ message: 'Failed to reject comment', error: error.message });
    }
  },

  // Delete a comment (Admin only)
  deleteComment: async (req, res) => {
    try {
      const { id } = req.params;
      const comment = await Comment.findByIdAndDelete(id);

      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }

      res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error('Error deleting comment:', error);
      res.status(500).json({ message: 'Failed to delete comment', error: error.message });
    }
  }
};

module.exports = commentController;
