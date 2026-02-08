const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
require('dotenv').config();

const samplePosts = [
  {
    title: "Getting Started with Artificial Intelligence in 2024",
    slug: "getting-started-ai-2024",
    excerpt: "Discover how to begin your AI journey with practical tips and resources for beginners.",
    body: "<h2>Introduction to AI</h2><p>Artificial Intelligence is transforming every industry. Whether you're a developer, business owner, or simply curious about technology, understanding AI is becoming essential.</p><h2>Key Concepts</h2><p>Machine Learning, Deep Learning, and Neural Networks are foundational concepts you'll need to understand. Start with Python programming and libraries like TensorFlow or PyTorch.</p><h2>Getting Started</h2><p>Begin with online courses from platforms like Coursera or edX. Practice with Kaggle datasets and join AI communities to learn from others.</p>",
    categories: ["Technology"],
    tags: ["AI", "Machine Learning", "Beginner"],
    status: "published"
  },
  {
    title: "10 Startup Ideas That Will Dominate 2024",
    slug: "startup-ideas-2024",
    excerpt: "Explore the most promising startup opportunities in AI, sustainability, and digital health.",
    body: "<h2>The Future of Startups</h2><p>2024 presents unique opportunities for entrepreneurs. From AI-powered solutions to sustainable technologies, here are the top 10 startup ideas to consider.</p><h2>1. AI Content Creation</h2><p>Tools that help creators generate content faster and more efficiently are in high demand.</p><h2>2. Sustainable E-commerce</h2><p>Eco-friendly products and carbon-neutral shipping are becoming consumer priorities.</p><h2>3. Digital Health Platforms</h2><p>Telemedicine and mental health apps continue to grow post-pandemic.</p>",
    categories: ["Startup"],
    tags: ["Entrepreneurship", "Business", "Ideas"],
    status: "published"
  },
  {
    title: "The Complete Guide to Modern JavaScript",
    slug: "modern-javascript-guide",
    excerpt: "Master ES6+, async/await, and modern JavaScript patterns for web development.",
    body: "<h2>Why Modern JavaScript?</h2><p>JavaScript has evolved significantly. ES6 and beyond introduced features that make code cleaner and more maintainable.</p><h2>Key Features</h2><ul><li>Arrow Functions</li><li>Destructuring</li><li>Spread Operator</li><li>Async/Await</li><li>Modules</li></ul><h2>Best Practices</h2><p>Use const by default, prefer template literals, and embrace functional programming patterns.</p>",
    categories: ["Technology"],
    tags: ["JavaScript", "Web Development", "Programming"],
    status: "published"
  },
  {
    title: "Building Your Personal Brand on Social Media",
    slug: "personal-brand-social-media",
    excerpt: "Learn how to establish a strong personal brand that attracts opportunities.",
    body: "<h2>Why Personal Branding Matters</h2><p>In today's digital age, your online presence is your resume. A strong personal brand opens doors to jobs, partnerships, and opportunities.</p><h2>Platform Strategy</h2><p>Focus on 2-3 platforms where your audience spends time. LinkedIn for professional networking, Twitter for thought leadership, Instagram for visual storytelling.</p><h2>Content is King</h2><p>Share valuable insights, be authentic, and engage with your community consistently.</p>",
    categories: ["Lifestyle"],
    tags: ["Branding", "Social Media", "Career"],
    status: "published"
  },
  {
    title: "Understanding Blockchain Beyond Cryptocurrency",
    slug: "blockchain-beyond-crypto",
    excerpt: "Explore real-world blockchain applications in supply chain, healthcare, and voting.",
    body: "<h2>Blockchain 101</h2><p>While cryptocurrency made blockchain famous, the technology has far-reaching applications beyond digital money.</p><h2>Supply Chain</h2><p>Track products from origin to consumer with immutable records, ensuring authenticity and reducing fraud.</p><h2>Healthcare</h2><p>Secure patient records while enabling seamless sharing between providers.</p><h2>Voting Systems</h2><p>Create transparent, tamper-proof election systems that increase trust in democracy.</p>",
    categories: ["Technology"],
    tags: ["Blockchain", "Innovation", "Fintech"],
    status: "published"
  },
  {
    title: "Remote Work: Tips for Maximum Productivity",
    slug: "remote-work-productivity-tips",
    excerpt: "Practical strategies to stay focused and productive while working from home.",
    body: "<h2>The Remote Work Revolution</h2><p>Working from home is now mainstream. Here's how to make the most of it.</p><h2>Create a Dedicated Workspace</h2><p>Separate work from personal life with a designated area for focus.</p><h2>Time Management</h2><p>Use techniques like Pomodoro, time blocking, and daily planning to stay on track.</p><h2>Communication</h2><p>Over-communicate with your team. Use video calls for important discussions and async tools for everything else.</p>",
    categories: ["Lifestyle"],
    tags: ["Remote Work", "Productivity", "Work From Home"],
    status: "published"
  },
  {
    title: "Investment Strategies for Beginners",
    slug: "investment-strategies-beginners",
    excerpt: "Start your investment journey with these fundamental strategies and tips.",
    body: "<h2>Getting Started with Investing</h2><p>Investing can seem intimidating, but starting early is key. Here's what you need to know.</p><h2>Diversification</h2><p>Don't put all your eggs in one basket. Spread investments across stocks, bonds, and other assets.</p><h2>Long-term Thinking</h2><p>Time in the market beats timing the market. Stay consistent and avoid emotional decisions.</p><h2>Start Small</h2><p>You don't need thousands to start. Many platforms allow investing with as little as $1.</p>",
    categories: ["Economy"],
    tags: ["Investing", "Finance", "Money"],
    status: "published"
  },
  {
    title: "The Power of AI in Content Creation",
    slug: "ai-content-creation-power",
    excerpt: "How AI tools like Aiblog are revolutionizing the way we create and consume content.",
    body: "<h2>AI Meets Creativity</h2><p>AI is not replacing creators—it's empowering them. Tools like Aiblog help generate ideas, improve writing, and streamline workflows.</p><h2>Time Savings</h2><p>What used to take hours now takes minutes. AI can suggest titles, generate outlines, and even write first drafts.</p><h2>Quality Enhancement</h2><p>AI helps improve grammar, readability, and SEO optimization.</p><h2>The Human Touch</h2><p>AI is a tool, not a replacement. The best content combines AI efficiency with human creativity and insight.</p>",
    categories: ["Technology"],
    tags: ["AI", "Content", "Blogging"],
    status: "published"
  }
];

const sampleComments = [
  {
    authorName: "John Doe",
    authorEmail: "john@example.com",
    content: "Great article! Very informative and well-written.",
    status: "approved"
  },
  {
    authorName: "Jane Smith",
    authorEmail: "jane@example.com",
    content: "This helped me understand the basics. Thanks for sharing!",
    status: "approved"
  },
  {
    authorName: "Mike Johnson",
    authorEmail: "mike@example.com",
    content: "Would love to see more content like this.",
    status: "pending"
  }
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.log('No MONGODB_URI found in .env');
      return;
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create Admin User
    const adminEmail = 'admin@aiblog.com';
    let admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('admin123', salt);

      admin = new User({
        name: 'Admin User',
        email: adminEmail,
        passwordHash,
        role: 'admin'
      });

      await admin.save();
      console.log('✅ Admin user created: admin@aiblog.com / admin123');
    } else {
      console.log('ℹ️  Admin user already exists');
    }

    // Create Super Admin User
    const superAdminEmail = 'superadmin@aiblog.com';
    let superAdmin = await User.findOne({ email: superAdminEmail });

    if (!superAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('superadmin123', salt);

      superAdmin = new User({
        name: 'Super Admin',
        email: superAdminEmail,
        passwordHash,
        role: 'superadmin'
      });

      await superAdmin.save();
      console.log('✅ Super Admin user created: superadmin@aiblog.com / superadmin123');
    } else {
      console.log('ℹ️  Super Admin user already exists');
    }

    // Check if posts already exist
    const existingPosts = await Post.countDocuments();
    if (existingPosts > 0) {
      console.log(`ℹ️  ${existingPosts} posts already exist. Skipping post creation.`);
    } else {
      // Create sample posts
      for (const postData of samplePosts) {
        const post = new Post({
          ...postData,
          authorId: admin._id,
          publishedAt: new Date()
        });
        await post.save();
        console.log(`✅ Created post: ${postData.title}`);

        // Add comments to first 3 posts
        if (samplePosts.indexOf(postData) < 3) {
          for (const commentData of sampleComments) {
            const comment = new Comment({
              ...commentData,
              postId: post._id
            });
            await comment.save();
          }
          console.log(`   + Added ${sampleComments.length} comments`);
        }
      }
      console.log(`\n✅ Seeded ${samplePosts.length} posts successfully!`);
    }

    console.log('\n📊 Database Summary:');
    console.log(`   Users: ${await User.countDocuments()}`);
    console.log(`   Posts: ${await Post.countDocuments()}`);
    console.log(`   Comments: ${await Comment.countDocuments()}`);

    mongoose.connection.close();
    console.log('\n✅ Seed complete! You can now login with:');
    console.log('   Email: admin@aiblog.com');
    console.log('   Password: admin123');
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
};

seedDatabase();
