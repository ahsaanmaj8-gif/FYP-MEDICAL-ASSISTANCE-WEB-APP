import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProfileDoc = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: '',
    consultationFee: '',
    followUpFee: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/doctor/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setProfile(response.data.data);
        setFormData({
          bio: response.data.data.bio || '',
          consultationFee: response.data.data.consultationFee || '',
          followUpFee: response.data.data.followUpFee || ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        'http://localhost:8085/api/v1/doctor/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Profile updated successfully');
        setProfile(response.data.data);
        setEditing(false);
      }
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <button
          onClick={() => setEditing(!editing)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          {editing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg border p-6">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {profile.user?.name?.charAt(0) || 'D'}
          </div>
          <div>
            <h2 className="text-2xl font-bold">{profile.user?.name}</h2>
            <p className="text-gray-600">{profile.specialization}</p>
            <p className="text-sm text-gray-500 mt-1">License: {profile.licenseNumber}</p>
          </div>
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Professional Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Tell patients about your experience..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Consultation Fee ($)</label>
                <input
                  type="number"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Follow-up Fee ($)</label>
                <input
                  type="number"
                  value={formData.followUpFee}
                  onChange={(e) => setFormData({ ...formData, followUpFee: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Professional Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Specialization:</span>
                    <span className="ml-2 font-medium">{profile.specialization}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Experience:</span>
                    <span className="ml-2 font-medium">{profile.experience} years</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Consultation Fee:</span>
                    <span className="ml-2 font-bold text-green-600">${profile.consultationFee}</span>
                  </p>
                  {profile.followUpFee > 0 && (
                    <p className="text-sm">
                      <span className="text-gray-500">Follow-up Fee:</span>
                      <span className="ml-2 font-medium">${profile.followUpFee}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="text-gray-500">Email:</span>
                    <span className="ml-2">{profile.user?.email}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-500">Phone:</span>
                    <span className="ml-2">{profile.user?.phone}</span>
                  </p>
                </div>
              </div>
            </div>

            {profile.bio && (
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">Bio</h3>
                <p className="text-sm text-gray-600">{profile.bio}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex space-x-4 text-sm">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {profile.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                  Rating: {profile.rating?.average || 'N/A'} ({profile.rating?.count || 0} reviews)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDoc;