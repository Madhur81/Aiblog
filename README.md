# Aiblog - AI-Powered Blog Platform

A full-stack blog application built with the MERN stack (MongoDB, Express, React, Node.js), featuring AI-powered content generation using Google Gemini API.

## ✨ Features

### Public Features
- 📝 Browse and read blog posts
- 🔍 Search posts by title and content
- 📂 Filter posts by category
- 📄 Pagination for post listings
- 💬 Comment on posts (with admin moderation)

### Admin Features
- 🔐 JWT-based authentication
- ✏️ Create, edit, and delete posts
- 🤖 AI-powered content generation:
  - Generate catchy blog titles
  - Auto-generate full blog content
  - Improve existing content
  - Suggest categories
- 🖼️ Image upload (ImageKit integration)
- 📊 Comment moderation (approve/reject)
- 📁 Post draft/publish workflow

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite, React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| AI | Google Gemini API |
| Images | ImageKit |
| Auth | JWT (JSON Web Tokens) |

## 📁 Project Structure

```
Aiblog/
├── client/                 # React frontend
│   ├── src/
│   │   ├── assets/        # Images and static assets
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service layer
│   │   └── App.jsx        # Main app with routing
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic (AI service)
│   ├── server.js         # Entry point
│   └── seed.js           # Database seeder
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Google Gemini API key
- ImageKit account (optional, for image uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Aiblog
```

### 2. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 3. Environment Variables

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aiblog
JWT_SECRET=your-super-secret-jwt-key
GEMINI_API_KEY=your-google-gemini-api-key
IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id
```

### 4. Seed the Database

```bash
cd server
node seed.js
```

This creates:
- Admin user: `admin@aiblog.com` / `admin123`
- 8 sample blog posts
- Sample comments

### 5. Start the Application

**Server (Terminal 1):**
```bash
cd server
npm run dev
# or: node server.js
```

**Client (Terminal 2):**
```bash
cd client
npm run dev
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **API:** http://localhost:5000/api

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email/password |
| POST | `/api/auth/register` | Register new admin (protected) |

### Posts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | Get all published posts (with pagination, search, filter) |
| GET | `/api/posts/:id` | Get single post by ID |
| POST | `/api/posts` | Create new post (admin) |
| PUT | `/api/posts/:id` | Update post (admin) |
| DELETE | `/api/posts/:id` | Delete post (admin) |

**Query Parameters for GET /api/posts:**
- `page` - Page number (default: 1)
- `limit` - Posts per page (default: 10)
- `q` - Search query (searches title, body, excerpt)
- `category` - Filter by category
- `tag` - Filter by tag

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/comments/posts/:postId` | Get approved comments for post |
| POST | `/api/comments/posts/:postId` | Submit new comment |
| GET | `/api/comments/admin` | Get all comments (admin) |
| PUT | `/api/comments/admin/:id/approve` | Approve comment (admin) |
| PUT | `/api/comments/admin/:id/reject` | Reject comment (admin) |
| DELETE | `/api/comments/admin/:id` | Delete comment (admin) |

### AI Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/generate-title` | Generate blog titles from topic |
| POST | `/api/ai/generate-content` | Generate full blog content |
| POST | `/api/ai/improve-content` | Improve existing content |
| POST | `/api/ai/suggest-category` | Suggest category for content |

### Upload
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/upload/auth` | Get ImageKit auth signature |
| POST | `/api/upload` | Upload image |

## 📊 Database Schema

### User
```javascript
{
  name: String (required),
  email: String (required, unique),
  passwordHash: String (required),
  role: String (enum: ['admin', 'user'], default: 'user')
}
```

### Post
```javascript
{
  title: String (required),
  slug: String (required, unique),
  excerpt: String,
  body: String,
  authorId: ObjectId (ref: User),
  categories: [String],
  tags: [String],
  featureImageUrl: String,
  status: String (enum: ['published', 'draft'], default: 'draft'),
  publishedAt: Date,
  metaTitle: String,
  metaDescription: String,
  canonicalUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```javascript
{
  postId: ObjectId (ref: Post, required),
  authorName: String (required),
  authorEmail: String (required),
  content: String (required),
  status: String (enum: ['pending', 'approved', 'rejected'], default: 'pending'),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Development Scripts

**Server:**
```bash
npm run dev    # Start with nodemon (auto-reload)
npm start      # Start production server
```

**Client:**
```bash
npm run dev    # Start Vite dev server
npm run build  # Build for production
npm run preview # Preview production build
```

## 🎨 Categories

The following categories are available:
- All
- Technology
- Startup
- Economy
- Lifestyle

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- Protected admin routes with middleware
- API keys stored in environment variables
- CORS configured for development

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Credits

- Built with ❤️ using the MERN stack
- AI powered by Google Gemini
- Image hosting by ImageKit
- Styling with Tailwind CSS
