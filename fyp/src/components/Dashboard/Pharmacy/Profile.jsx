import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Profilee = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    pharmacyName: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Pakistan'
    },
    businessHours: [],
    deliveryAvailable: false,
    deliveryRadius: 0
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching profile with token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get('http://localhost:8085/api/v1/pharmacy/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Profile API response:', response.data);
      
      if (response.data.success) {
        const profileData = response.data.data;
        setProfile(profileData);
        
        // Set form data with proper defaults
        setFormData({
          pharmacyName: profileData.pharmacyName || '',
          phone: profileData.phone || '',
          address: profileData.address || {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
          },
          businessHours: profileData.businessHours || [],
          deliveryAvailable: profileData.deliveryAvailable || false,
          deliveryRadius: profileData.deliveryRadius || 0
        });
      } else {
        toast.error(response.data.message || 'Failed to load profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log('Updating profile with data:', formData);
      
      const response = await axios.put(
        'http://localhost:8085/api/v1/pharmacy/profile',
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      
      if (response.data.success) {
        setProfile(response.data.data);
        setEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">👤 Pharmacy Profile</h1>
        <div className="text-center py-12">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">👤 Pharmacy Profile</h1>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-bold">Profile Not Found</p>
          <p>Your pharmacy profile could not be loaded.</p>
          <button
            onClick={fetchProfile}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👤 Pharmacy Profile</h1>
        <div className="flex space-x-2">
          <button
            onClick={fetchProfile}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
          >
            Refresh
          </button>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            {editing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border p-6">
        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Pharmacy Name *</label>
                <input
                  type="text"
                  value={formData.pharmacyName}
                  onChange={(e) => setFormData({...formData, pharmacyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  required
                  placeholder="Enter pharmacy name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="0300-1234567"
                />
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2 text-gray-800">Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Street</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="House/Street number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="State/Province"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Postal code"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <input
                type="checkbox"
                id="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={(e) => setFormData({...formData, deliveryAvailable: e.target.checked})}
                className="h-5 w-5 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="deliveryAvailable" className="ml-3 text-gray-700 font-medium">
                Offer Delivery Service
              </label>
            </div>

            {formData.deliveryAvailable && (
              <div className="p-4 bg-purple-50 rounded-lg">
                <label className="block text-sm font-medium mb-2 text-purple-800">
                  Delivery Radius (kilometers)
                </label>
                <input
                  type="number"
                  value={formData.deliveryRadius}
                  onChange={(e) => setFormData({...formData, deliveryRadius: e.target.value})}
                  className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                  min="0"
                  step="1"
                  placeholder="e.g., 10"
                />
                <p className="text-xs text-purple-600 mt-2">
                  Maximum distance you're willing to deliver medicines
                </p>
              </div>
            )}

            <div className="flex space-x-3 pt-4">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)}
                className="bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white text-3xl font-bold">
                  {profile.pharmacyName?.charAt(0)?.toUpperCase() || 'P'}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profile.pharmacyName}</h2>
                <p className="text-gray-600 mt-1">License: {profile.licenseNumber}</p>
                <p className="text-gray-600">Phone: {profile.phone || 'Not provided'}</p>
                <p className="text-gray-600">Email: {profile.user?.email || 'N/A'}</p>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.isVerified 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {profile.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                profile.deliveryAvailable 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {profile.deliveryAvailable ? '🚚 Delivery Available' : '🏪 Pickup Only'}
              </span>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                Joined: {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Address Section */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-gray-800 mb-3">📍 Pharmacy Address</h3>
              {profile.address?.street ? (
                <div className="text-gray-700">
                  <p className="font-medium">{profile.address.street}</p>
                  <p>{profile.address.city}{profile.address.state && `, ${profile.address.state}`}</p>
                  <p>{profile.address.zipCode && `Postal Code: ${profile.address.zipCode}`}</p>
                  <p>{profile.address.country || 'Pakistan'}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">No address provided</p>
              )}
            </div>

            {/* Delivery Info */}
            {profile.deliveryAvailable && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-bold text-blue-800 mb-2">🚚 Delivery Information</h3>
                <div className="flex items-center space-x-4">
                  <div className="text-blue-700">
                    <p className="font-medium">Delivery Radius:</p>
                    <p className="text-2xl font-bold">{profile.deliveryRadius || 0} km</p>
                  </div>
                  <div className="text-blue-700">
                    <p className="text-sm">Maximum distance for home delivery</p>
                  </div>
                </div>
              </div>
            )}

            {/* Business Hours */}
            {profile.businessHours && profile.businessHours.length > 0 && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-bold text-green-800 mb-3">🕒 Business Hours</h3>
                <div className="space-y-2">
                  {profile.businessHours.map((hour, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="font-medium capitalize">{hour.day}:</span>
                      <span>
                        {hour.isOpen 
                          ? `${hour.openTime} - ${hour.closeTime}`
                          : 'Closed'
                        }
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profilee;