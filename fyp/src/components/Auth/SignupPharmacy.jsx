import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupPharmacy = () => {
  const navigate = useNavigate();

  // Separate State Variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

  // Address State
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  // Pharmacy Business Info
  const [pharmacyName, setPharmacyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [pharmacyEmail, setPharmacyEmail] = useState('');

  // Delivery Information
  const [deliveryAvailable, setDeliveryAvailable] = useState(false);
  const [deliveryRadius, setDeliveryRadius] = useState('');

  // Business Hours State
  const [businessHours, setBusinessHours] = useState([
    { day: 'monday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'tuesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'wednesday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'thursday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'friday', openTime: '09:00', closeTime: '18:00', isOpen: true },
    { day: 'saturday', openTime: '10:00', closeTime: '16:00', isOpen: true },
    { day: 'sunday', openTime: '10:00', closeTime: '14:00', isOpen: false }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Address Changes
  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle Business Hours Changes
  const handleBusinessHoursChange = (index, field, value) => {
    const updatedHours = businessHours.map((hour, i) => 
      i === index ? { ...hour, [field]: value } : hour
    );
    setBusinessHours(updatedHours);
  };

  const handleDayToggle = (index) => {
    const updatedHours = businessHours.map((hour, i) => 
      i === index ? { ...hour, isOpen: !hour.isOpen } : hour
    );
    setBusinessHours(updatedHours);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  const getDayLabel = (day) => {
    const dayLabels = {
      monday: 'Monday',
      tuesday: 'Tuesday', 
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday'
    };
    return dayLabels[day] || day;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validations
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    // Required fields validation
    const requiredFields = {
      name, email, password, phone, pharmacyName, licenseNumber
    };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData
      const data = new FormData();
      
      // Basic user fields
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      data.append("phone", phone);
      data.append("role", "pharmacy");
      
      // Address (stringify)
      data.append("address", JSON.stringify(address));
      
      // Pharmacy info (stringify) - NOW INCLUDES BUSINESS HOURS
      data.append("pharmacyInfo", JSON.stringify({
        // Required fields
        pharmacyName: pharmacyName,
        licenseNumber: licenseNumber,
        
        // Optional contact info
        phone: pharmacyPhone || "",
        email: pharmacyEmail || "",
        
        // Address (same as user address)
        address: address,
        
        // Business hours (from form)
        businessHours: businessHours,
        
        // Delivery information
        deliveryAvailable: deliveryAvailable,
        deliveryRadius: deliveryAvailable ? parseFloat(deliveryRadius) || 0 : 0
      }));

      // Profile picture
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      console.log("Pharmacy Registration Data:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        'http://localhost:8085/api/v1/auth/register', 
        data, 
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <Link to="/role-selection" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MediCare - Pharmacy Registration</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Owner Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Owner Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Owner Full Name"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Owner Email"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Owner Phone"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleAddressChange("street", e.target.value)}
                    placeholder="Street Address"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    placeholder="ZIP Code"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Pharmacy Business Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmacy Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name *</label>
                  <input
                    type="text"
                    value={pharmacyName}
                    onChange={(e) => setPharmacyName(e.target.value)}
                    placeholder="Pharmacy Name"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="Pharmacy License Number"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Phone</label>
                  <input
                    type="text"
                    value={pharmacyPhone}
                    onChange={(e) => setPharmacyPhone(e.target.value)}
                    placeholder="Pharmacy Phone"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Email</label>
                  <input
                    type="email"
                    value={pharmacyEmail}
                    onChange={(e) => setPharmacyEmail(e.target.value)}
                    placeholder="Pharmacy Email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-4">
                {businessHours.map((hour, index) => (
                  <div key={hour.day} className="flex items-center space-x-4 p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={hour.isOpen}
                        onChange={() => handleDayToggle(index)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label className="text-sm font-medium text-gray-700 w-24">
                        {getDayLabel(hour.day)}
                      </label>
                    </div>
                    
                    {hour.isOpen ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <div className="flex items-center space-x-1">
                          <label className="text-xs text-gray-500">Open</label>
                          <input
                            type="time"
                            value={hour.openTime}
                            onChange={(e) => handleBusinessHoursChange(index, 'openTime', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="flex items-center space-x-1">
                          <label className="text-xs text-gray-500">Close</label>
                          <input
                            type="time"
                            value={hour.closeTime}
                            onChange={(e) => handleBusinessHoursChange(index, 'closeTime', e.target.value)}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Closed</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delivery Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={deliveryAvailable}
                    onChange={(e) => setDeliveryAvailable(e.target.checked)}
                    className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">Delivery Service Available</label>
                </div>
                
                {deliveryAvailable && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Delivery Radius (kilometers)
                    </label>
                    <input
                      type="number"
                      value={deliveryRadius}
                      onChange={(e) => setDeliveryRadius(e.target.value)}
                      placeholder="e.g., 10"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="0"
                      step="0.1"
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 text-white py-3 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50 transition duration-200"
            >
              {isLoading ? 'Submitting for Verification...' : 'Submit for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPharmacy;