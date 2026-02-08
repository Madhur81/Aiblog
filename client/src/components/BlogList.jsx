import React, { useEffect, useState, useCallback } from 'react';
import BlogItem from './BlogItem';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { blogCategories } from '../assets/assets';
import { apiService } from '../services/api';

const BlogList = () => {
  const [menu, setMenu] = useState("All");
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    total: 0,
    pages: 1
  });

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };

      // Add search query if present
      if (searchQuery) {
        params.q = searchQuery;
      }

      // Add category filter if not "All"
      if (menu !== "All") {
        params.category = menu;
      }

      const data = await apiService.getPosts(params);
      // Handle new API format { posts: [...], pagination: {...} } or old format [...]
      const posts = data.posts || data;
      setBlogs(Array.isArray(posts) ? posts : []);

      if (data.pagination) {
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          pages: data.pagination.pages
        }));
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, menu]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on search
  }, []);

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (category) => {
    setMenu(category);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on category change
  };

  return (
    <div className="px-5 md:px-12 lg:px-28">
      {/* Search Bar */}
      <div className="flex justify-center my-8">
        <SearchBar onSearch={handleSearch} placeholder="Search blogs by title or content..." />
      </div>

      {/* Category Filter */}
      <div className='flex justify-center gap-3 sm:gap-6 my-10 flex-wrap'>
        {blogCategories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryChange(category)}
            className={`py-1 px-4 rounded-sm transition-colors ${menu === category
              ? 'bg-black text-white'
              : 'bg-gray-200 hover:bg-gray-300'
              }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Blog Posts Grid */}
      {loading ? (
        <div className="text-center py-20">Loading posts...</div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `No posts found matching "${searchQuery}"`
              : "No posts found in this category"}
          </p>
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="mt-4 text-blue-600 underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12 mb-16 xl:mx-24 justify-items-center'>
            {blogs.map((item, index) => (
              <BlogItem
                key={item._id || index}
                id={item._id}
                image={item.featureImageUrl || item.image}
                title={item.title}
                description={item.body || item.description}
                category={item.categories?.[0] || 'Uncategorized'}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default BlogList;
