import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupLaboratory = () => {
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
    street: '', city: '', state: '', zipCode: '', country: ''
  });

  // Laboratory Business Info
  const [labName, setLabName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [labPhone, setLabPhone] = useState('');
  const [labEmail, setLabEmail] = useState('');

  // Services
  const [homeCollectionAvailable, setHomeCollectionAvailable] = useState(false);

  // Business Hours State
  const [businessHours, setBusinessHours] = useState([
    { day: 'monday', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'tuesday', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'wednesday', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'thursday', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'friday', openTime: '08:00', closeTime: '18:00', isOpen: true },
    { day: 'saturday', openTime: '09:00', closeTime: '14:00', isOpen: true },
    { day: 'sunday', openTime: '09:00', closeTime: '12:00', isOpen: false }
  ]);

  // Tests Available
  const [testsAvailable, setTestsAvailable] = useState([
    {
      testName: 'Complete Blood Count',
      category: 'Hematology',
      price: '',
      duration: '24 hours',
      description: ''
    }
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Address Changes
  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
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

  // Handle Tests Changes
  const handleTestChange = (index, field, value) => {
    const updatedTests = testsAvailable.map((test, i) =>
      i === index ? { ...test, [field]: value } : test
    );
    setTestsAvailable(updatedTests);
  };

  const addTest = () => {
    setTestsAvailable(prev => [...prev, {
      testName: '', category: '', price: '', duration: '24 hours', description: ''
    }]);
  };

  const removeTest = (index) => {
    setTestsAvailable(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setProfilePicture(file);
  };

  const getDayLabel = (day) => {
    const dayLabels = {
      monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
      thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday'
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

    const requiredFields = { name, email, password, phone, labName, licenseNumber };
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => !value)
      .map(([key]) => key);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      // Create FormData (like pharmacy & doctor)
      const data = new FormData();

      // Basic user fields
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      data.append("phone", phone);
      data.append("role", "laboratory");

      // Address (stringify)
      data.append("address", JSON.stringify(address));

      // Laboratory info (stringify) - INCLUDES BUSINESS HOURS & TESTS
      data.append("laboratoryInfo", JSON.stringify({
        // Required fields
        labName: labName,
        licenseNumber: licenseNumber,

        // Optional contact info
        phone: labPhone || "",
        email: labEmail || "",

        // Address
        address: address,

        // Business hours (from form)
        businessHours: businessHours,

        // Services
        homeCollectionAvailable: homeCollectionAvailable,

        // Tests available
        // testsAvailable: testsAvailable.filter(test => test.testName && test.category)


        testsAvailable: testsAvailable
          .filter(test => test.testName && (test.category || test.customCategory))
          .map(test => ({
            ...test,
            category: test.category === 'Other'
              ? test.customCategory
              : test.category
          }))

      }));

      // Profile picture
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      console.log("Laboratory Registration Data:");
      for (let [key, value] of data.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        'http://localhost:8085/api/v1/auth/register',
        data,
        {
          headers: { "Content-Type": "multipart/form-data" }
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

  const testCategories = [
    'Hematology', 'Biochemistry', 'Microbiology', 'Immunology',
    'Pathology', 'Radiology', 'Cardiology', 'Neurology', 'Other'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-5xl">
        <Link to="/role-selection" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MediCare - Laboratory Registration</span>
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleAddressChange("city", e.target.value)}
                    placeholder="City"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleAddressChange("state", e.target.value)}
                    placeholder="State"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                    placeholder="ZIP Code"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Laboratory Business Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Laboratory Business Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Name *</label>
                  <input
                    type="text"
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    placeholder="Laboratory Name"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="Laboratory License Number"
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Phone</label>
                  <input
                    type="text"
                    value={labPhone}
                    onChange={(e) => setLabPhone(e.target.value)}
                    placeholder="Laboratory Phone"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Laboratory Email</label>
                  <input
                    type="email"
                    value={labEmail}
                    onChange={(e) => setLabEmail(e.target.value)}
                    placeholder="Laboratory Email"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                        className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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

            {/* Services */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services</h3>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={homeCollectionAvailable}
                  onChange={(e) => setHomeCollectionAvailable(e.target.checked)}
                  className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label className="text-sm font-medium text-gray-700">Home Collection Service Available</label>
              </div>
            </div>

            {/* Tests Available */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tests Available</h3>
              <div className="space-y-4">
                {testsAvailable.map((test, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
                      <input
                        placeholder="Test Name"
                        value={test.testName}
                        onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={test.category === 'Other' ? 'Other' : test.category}
                        onChange={(e) => handleTestChange(index, 'category', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      >
                        <option value="">Select Category</option>
                        {testCategories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>


                      {test.category === 'Other' && (
                        <input
                          type="text"
                          placeholder="Enter custom category"
                          value={test.customCategory || ''}
                          onChange={(e) =>
                            handleTestChange(index, 'customCategory', e.target.value)
                          }
                          className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2"
                        />
                      )}



                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input
                        type="number"
                        placeholder="Price"
                        value={test.price}
                        onChange={(e) => handleTestChange(index, 'price', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                      <input
                        placeholder="Duration"
                        value={test.duration}
                        onChange={(e) => handleTestChange(index, 'duration', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                      />
                    </div>
                    <div className="flex items-end">
                      {testsAvailable.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeTest(index)}
                          className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="md:col-span-5">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        placeholder="Test description"
                        value={test.description}
                        onChange={(e) => handleTestChange(index, 'description', e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        rows="2"
                      />
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTest}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Add Test
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-3 rounded-md font-semibold hover:bg-orange-700 disabled:opacity-50 transition duration-200"
            >
              {isLoading ? 'Submitting for Verification...' : 'Submit for Verification'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupLaboratory;