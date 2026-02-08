const Post = require('../models/Post');

// Get all posts with search, pagination, and filtering
// Get all posts with search, pagination, and filtering
exports.getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, q, category, tag, mine } = req.query;
    let query = { status: 'published' }; // Default: Only show published posts publicly

    // If 'mine' is true and user is authenticated
    if (mine === 'true' && req.user) {
      if (req.user.role === 'superadmin') {
        // Superadmin sees ALL posts (drafts and published) from EVERYONE when mine=true is passed (admin view)
        // effectively removing the { status: 'published' } filter
        query = {};
      } else {
        // Regular admin sees only their own posts (drafts and published)
        query = { authorId: req.user.id };
      }
    }

    // Search functionality
    if (q) {
      const searchRegex = { $regex: q, $options: 'i' };
      const searchOr = [
        { title: searchRegex },
        { body: searchRegex },
        { excerpt: searchRegex }
      ];

      if (query.authorId) {
        query.$and = [
          { authorId: query.authorId },
          { $or: searchOr }
        ];
        delete query.authorId;
      } else {
        if (Object.keys(query).length === 0) {
          query.$or = searchOr;
        } else if (query.status) {
          query.$and = [
            { status: 'published' },
            { $or: searchOr }
          ];
          delete query.status;
        }
      }
    }

    // Category filter
    if (category && category !== 'All') {
      query.categories = category;
    }

    // Tag filter
    if (tag) {
      query.tags = tag;
    }

    const skip = (page - 1) * limit;
    const posts = await Post.find(query)
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .populate('authorId', 'name email profileImg');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('authorId', 'name email profileImg');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create post (Admin only)
exports.createPost = async (req, res) => {
  const { title, slug, excerpt, body, categories, tags, featureImageUrl, status } = req.body;

  // Simple validation
  if (!title || !slug) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newPost = new Post({
      title,
      slug,
      excerpt,
      body,
      authorId: req.user.id, // Enforce author from authenticated user
      categories,
      tags,
      featureImageUrl,
      status: status || 'published', // Default to published for MVP
      publishedAt: status === 'draft' ? null : new Date()
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update post (Admin only)
exports.updatePost = async (req, res) => {
  const { title, slug, excerpt, body, authorId, categories, tags, featureImageUrl, status, metaTitle, metaDescription, canonicalUrl } = req.body;

  try {
    const updateData = {
      title,
      slug,
      excerpt,
      body,
      // authorId, // Do not allow changing author
      categories,
      tags,
      featureImageUrl,
      status,
      metaTitle,
      metaDescription,
      canonicalUrl
    };

    // Only update publishedAt when changing from draft to published
    if (status === 'published') {
      const existingPost = await Post.findById(req.params.id);
      if (existingPost && existingPost.status === 'draft') {
        updateData.publishedAt = new Date();
      }
    }

    // Check ownership if not superadmin
    if (req.user.role !== 'superadmin') {
      const existing = await Post.findById(req.params.id);
      if (existing && existing.authorId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this post' });
      }
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const Comment = require('../models/Comment'); // Import Comment model

// Delete post (Admin only)
exports.deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);
    if (!postToDelete) return res.status(404).json({ message: 'Post not found' });

    // Check ownership if not superadmin
    if (req.user.role !== 'superadmin' && postToDelete.authorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    // Delete associated comments
    await Comment.deleteMany({ postId: req.params.id });

    res.json({ message: 'Post and associated comments deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
