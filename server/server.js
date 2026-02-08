const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Routes
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload');
const aiRoutes = require('./routes/ai');
const commentRoutes = require('./routes/comments');
const subscriptionRoutes = require('./routes/subscription');
const statsRoutes = require('./routes/stats');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/stats', statsRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Aiblog API is running');
});

// Database Connection
const prompt = "Connecting to MongoDB...";
console.log(prompt);

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log('MongoDB Connection Error:', err));
} else {
  console.log('MONGODB_URI not found in .env. Skipping DB connection.');
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
