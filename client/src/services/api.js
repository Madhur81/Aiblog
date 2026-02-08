import axios from 'axios';
import ImageKit from "imagekit-javascript";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure ImageKit (keys will be fetched from server for signature, but public key needed here)
const imagekit = new ImageKit({
  publicKey: "public_o5/zh01yxL+Cr4Aay7WAdUTC0pk=",
  urlEndpoint: "https://ik.imagekit.io/zb6ut4ndn",
  authenticationEndpoint: "http://localhost:5000/api/upload/auth"
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const apiService = {
  // Media
  uploadImage: async (file) => {
    try {
      // Convert file to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const base64 = await base64Promise;

      // Send to server for upload
      const response = await api.post('/upload/image', {
        file: base64,
        fileName: file.name
      });

      return response.data.url;
    } catch (error) {
      console.error("Image Upload Error:", error);
      throw new Error(`Failed to upload image: ${error.response?.data?.message || error.message}`);
    }
  },

  // Auth
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Posts
  getPosts: async (params = {}) => {
    const response = await api.get('/posts', { params });
    return response.data;
  },
  getPost: async (id) => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },
  updatePost: async (id, postData) => {
    const response = await api.put(`/posts/${id}`, postData);
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  // Comments
  getComments: async (postId) => {
    const response = await api.get(`/comments/posts/${postId}`);
    return response.data;
  },
  createComment: async (postId, commentData) => {
    const response = await api.post(`/comments/posts/${postId}`, commentData);
    return response.data;
  },
  getAllComments: async (params = {}) => {
    const response = await api.get('/comments/admin', { params });
    return response.data;
  },
  approveComment: async (id) => {
    const response = await api.put(`/comments/admin/${id}/approve`);
    return response.data;
  },
  rejectComment: async (id) => {
    const response = await api.put(`/comments/admin/${id}/reject`);
    return response.data;
  },
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/admin/${id}`);
    return response.data;
  },

  // AI Services
  generateTitle: async (topic, keywords = []) => {
    const response = await api.post('/ai/generate-title', { topic, keywords });
    return response.data;
  },
  generateContent: async (title, keywords = [], tone = 'professional') => {
    const response = await api.post('/ai/generate-content', { title, keywords, tone });
    return response.data;
  },
  improveContent: async (content) => {
    const response = await api.post('/ai/improve-content', { content });
    return response.data;
  },
  suggestCategory: async (content, availableCategories = []) => {
    const response = await api.post('/ai/suggest-category', { content, availableCategories });
    return response.data;
  },

  // Subscriptions
  subscribe: async (email) => {
    const response = await api.post('/subscriptions/subscribe', { email });
    return response.data;
  },

  // Stats
  getDashboardStats: async () => {
    const response = await api.get('/stats/dashboard');
    return response.data;
  }
};
