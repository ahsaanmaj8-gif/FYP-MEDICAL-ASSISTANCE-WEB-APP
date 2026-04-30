import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LabTestBookingPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: 'male',
    patientPhone: '',
    collectionDate: '',
    collectionType: 'lab',
    address: '',
    notes: ''
  });

  useEffect(() => {
    fetchTestDetails();
  }, [testId]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8085/api/v1/public/lab-tests/${testId}`);
      
      if (response.data.success) {
        setTest(response.data.data);
      } else {
        toast.error('Test not found');
        navigate('/lab-tests');
      }
    } catch (error) {
      console.error('Fetch test error:', error);
      toast.error('Failed to load test details');
      navigate('/lab-tests');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.patientName.trim()) {
      toast.error('Please enter patient name');
      return;
    }
    
    if (!formData.patientPhone.trim()) {
      toast.error('Please enter phone number');
      return;
    }
    
    if (!formData.collectionDate) {
      toast.error('Please select collection date');
      return;
    }

    if (formData.collectionType === 'home' && !formData.address.trim()) {
      toast.error('Address required for home collection');
      return;
    }

    // Check if home collection is selected but not available
    if (formData.collectionType === 'home' && !test?.lab?.homeCollectionAvailable) {
      toast.error('Home collection is not available for this lab');
      return;
    }

    try {
      setBooking(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to book a test');
        navigate('/login', { state: { from: `/lab-tests/book/${testId}` } });
        return;
      }

      const bookingData = {
        testId,
        ...formData
      };

      const response = await axios.post(
        'http://localhost:8085/api/v1/lab-booking/book',
        bookingData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      if (response.data.success) {
        toast.success('Test booked successfully! 🎉');
        
        // Store booking details
        localStorage.setItem('lastBooking', JSON.stringify({
          ...response.data.data,
          testName: test.testName,
          labName: test.lab?.name
        }));
        
        setTimeout(() => {
          navigate('/patient/lab-tests');
        }, 1500);
      }
    } catch (err) {
      console.error('Booking error:', err);
      const errorMsg = err.response?.data?.message || 'Booking failed. Please try again.';
      toast.error(errorMsg);
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h2 className="text-2xl font-bold mb-2">Test Not Found</h2>
          <p className="text-gray-600 mb-4">The test you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/lab-tests')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Browse Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate('/lab-tests')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center"
        >
          ← Back to Tests
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Test Info Card */}
          <div className="bg-white p-6 rounded-xl shadow-md border">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔬</div>
              <h2 className="text-xl font-bold">{test.testName}</h2>
              <p className="text-gray-500">{test.lab?.name}</p>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span>{test.category || 'General'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price</span>
                <span className="font-bold text-green-600">{test.price || 'Contact'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Report Time</span>
                <span>{test.duration || '24-48 hours'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Home Collection</span>
                <span className={test.lab?.homeCollectionAvailable ? 'text-green-600' : 'text-red-600'}>
                  {test.lab?.homeCollectionAvailable ? 'Available' : 'Not Available'}
                </span>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-700 p-4 rounded-lg text-sm">
              <p className="font-medium">📞 {test.lab?.phone || 'Contact lab for details'}</p>
              {test.lab?.address && (
                <p className="mt-1">📍 {test.lab.address.street}, {test.lab.address.city}</p>
              )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border">
            <h2 className="text-2xl font-bold mb-6">Book Test</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    placeholder="Full name"
                    value={formData.patientName}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    placeholder="Age in years"
                    value={formData.patientAge}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                    min="0"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    name="patientGender"
                    value={formData.patientGender}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="patientPhone"
                    placeholder="+92 300 1234567"
                    value={formData.patientPhone}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Date *
                  </label>
                  <input
                    type="date"
                    name="collectionDate"
                    value={formData.collectionDate}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Type
                  </label>
                  <select
                    name="collectionType"
                    value={formData.collectionType}
                    onChange={handleChange}
                    className="border p-3 rounded w-full"
                    disabled={!test.lab?.homeCollectionAvailable}
                  >
                    <option value="lab">🏥 Lab Visit</option>
                    <option value="home" disabled={!test.lab?.homeCollectionAvailable}>
                      🚗 Home Collection {!test.lab?.homeCollectionAvailable && '(Not Available)'}
                    </option>
                  </select>
                </div>
              </div>

              {formData.collectionType === 'home' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Complete Address *
                  </label>
                  <textarea
                    name="address"
                    placeholder="House #, Street, Area, City"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className="border p-3 rounded w-full"
                    required
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (optional)
                </label>
                <textarea
                  name="notes"
                  placeholder="Any special instructions or medical conditions"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                  className="border p-3 rounded w-full"
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 text-sm">
                  💡 <strong>Note:</strong> You'll pay at the time of sample collection. 
                  Our executive will contact you for confirmation.
                </p>
              </div>

              <button
                type="submit"
                disabled={booking}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {booking ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabTestBookingPage;