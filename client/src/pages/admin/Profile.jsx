import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImg: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const user = await apiService.getMe();
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        profileImg: user.profileImg || ''
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      let imageUrl = formData.profileImg;

      if (image) {
        try {
          imageUrl = await apiService.uploadImage(image);
        } catch (imgError) {
          console.warn('Image upload skipped:', imgError.message);
          toast.warning('Failed to upload image, proceeding with text updates');
        }
      }

      const updateData = {
        name: formData.name,
        email: formData.email,
        profileImg: imageUrl
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      await apiService.updateProfile(updateData);
      toast.success('Profile updated successfully');
      // Trigger auth-change to update Navbar
      window.dispatchEvent(new Event('auth-change'));

      setFormData(prev => ({ ...prev, password: '', confirmPassword: '', profileImg: imageUrl }));
      setImage(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className='p-5 sm:p-10'>Loading profile...</div>;
  }

  return (
    <div className='p-5 sm:p-10 w-full max-w-4xl'>
      <h1 className='text-2xl font-bold mb-8'>Profile Settings</h1>

      <div className='bg-white border rounded-lg p-8 shadow-sm'>
        <div className='flex items-center gap-4 mb-8'>
          <label htmlFor="profile-image" className="cursor-pointer relative group">
            <div className='w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-transparent group-hover:border-black transition-all'>
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Profile Preview" className="w-full h-full object-cover" />
              ) : formData.profileImg ? (
                <img src={formData.profileImg} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="text-3xl font-bold text-gray-500">{formData.name.charAt(0).toUpperCase()}</div>
              )}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-white text-xs">Change</span>
            </div>
          </label>
          <input
            type="file"
            id="profile-image"
            hidden
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div>
            <h2 className='text-xl font-semibold'>{formData.name}</h2>
            <p className='text-gray-500'>Admin</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6 max-w-lg'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-black'
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-black'
              required
            />
          </div>

          <div className='pt-4 border-t'>
            <h3 className='text-lg font-medium mb-4'>Change Password</h3>
            <p className='text-sm text-gray-500 mb-4'>Leave blank to keep current password</p>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-black'
                  placeholder="New password"
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border rounded-md focus:outline-none focus:border-black'
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className='w-full sm:w-auto bg-black text-white px-8 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400'
          >
            {submitting ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
