const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Subscription = require('../models/Subscription');

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id; // userId is always available from auth middleware

    let postQuery = {};
    let commentQuery = {};
    let userPostIds = []; // Initialize userPostIds for scope

    if (req.user.role !== 'superadmin') {
      // For regular users, filter by their posts
      postQuery = { authorId: userId };

      // Find all post IDs belonging to the user for comment filtering
      userPostIds = await Post.find({ authorId: userId }).distinct('_id');
      commentQuery = { postId: { $in: userPostIds } };
    }
    // If superadmin, postQuery and commentQuery remain empty, fetching all documents

    // Get counts
    // 1. Posts
    const totalPosts = await Post.countDocuments(postQuery);
    const publishedPosts = await Post.countDocuments({ ...postQuery, status: 'published' });
    const draftPosts = await Post.countDocuments({ ...postQuery, status: 'draft' });

    // 2. Comments
    const totalComments = await Comment.countDocuments(commentQuery);
    const pendingComments = await Comment.countDocuments({ ...commentQuery, status: 'pending' });
    const approvedComments = await Comment.countDocuments({ ...commentQuery, status: 'approved' });

    // 3. Subscribers (Global for now, as Subscription doesn't have owner)
    const totalSubscribers = await Subscription.countDocuments({ active: true });

    // Recent Posts
    const recentPosts = await Post.find(postQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt categories');

    // Recent Comments
    const recentComments = await Comment.find(commentQuery)
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('postId', 'title')
      .select('authorName content status createdAt');

    res.json({
      stats: {
        posts: {
          total: totalPosts,
          published: publishedPosts,
          draft: draftPosts
        },
        comments: {
          total: totalComments,
          pending: pendingComments,
          approved: approvedComments
        },
        subscribers: totalSubscribers
      },
      recentPosts,
      recentComments
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard stats' });
  }
};
