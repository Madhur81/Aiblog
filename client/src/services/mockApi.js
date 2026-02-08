import { blog_data, dashboard_data, comments_data } from '../assets/assets';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  getPosts: async () => {
    await delay(500);
    return blog_data;
  },
  getPost: async (id) => {
    await delay(500);
    return blog_data.find(post => post._id === id);
  },
  getDashboardStats: async () => {
    await delay(500);
    return dashboard_data;
  },
  login: async (credentials) => {
    await delay(800);
    if (credentials.email === 'admin@aiblog.com' && credentials.password === 'admin123') {
      return { token: 'mock-jwt-token', user: { name: 'Admin User', role: 'admin' } };
    }
    throw new Error('Invalid credentials');
  }
};
