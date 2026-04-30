import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [specialties, setSpecialties] = useState([]);
  const [filters, setFilters] = useState({
    specialization: '',
    city: '',
    minExperience: '',
    maxFee: '',
    sort: 'rating',
    videoConsultationAvailable: '' // This matches backend parameter name
  });
  const [initialized, setInitialized] = useState(false);
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize filters from URL only once
  useEffect(() => {
    if (!initialized) {
      const params = new URLSearchParams(location.search);
      const specialtyFromUrl = params.get('specialty');
      
      if (specialtyFromUrl) {
        setFilters(prev => ({ 
          ...prev, 
          specialization: decodeURIComponent(specialtyFromUrl) 
        }));
      }
      setInitialized(true);
    }
  }, [location.search, initialized]);

  // Fetch doctors when filters change
  useEffect(() => {
    if (initialized) {
      fetchDoctors();
    }
  }, [filters, initialized]);

  // Fetch specialties only once
  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      
      // Create a copy of filters and remove empty values
      const params = {};
      Object.keys(filters).forEach(key => {
        if (filters[key] !== '' && filters[key] !== null && filters[key] !== undefined) {
          params[key] = filters[key];
        }
      });

      console.log('Fetching with params:', params); // Debug log

      const response = await axios.get('http://localhost:8085/api/v1/public/doctors', {
        params: params
      });
      
      if (response.data.success) {
        setDoctors(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/v1/public/specialties');
      if (response.data.success) {
        setSpecialties(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleBookAppointment = (doctorId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/book-appointment/${doctorId}` } });
      return;
    }
    navigate(`/book-appointment/${doctorId}`);
  };

  const clearFilters = () => {
    setFilters({
      specialization: '',
      city: '',
      minExperience: '',
      maxFee: '',
      sort: 'rating',
      videoConsultationAvailable: ''
    });
    // Fetch after clearing
    setTimeout(() => fetchDoctors(), 100);
  };

  const handleResetSpecialty = () => {
    setFilters(prev => ({ ...prev, specialization: '' }));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl  p-8 mb-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-blue-900' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Find the Right Doctor
          </h1>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Book appointments with verified doctors near you
          </p>
          
          {/* Show active specialty filter */}
          {filters.specialization && (
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
              theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
            }`}>
              <span className={theme === 'dark' ? 'text-blue-300' : 'text-blue-700'}>
                Specialty: {filters.specialization}
              </span>
              <button
                onClick={handleResetSpecialty}
                className={`text-sm ${
                  theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            <div className={`sticky top-24 p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } shadow-lg`}>
              <h3 className="text-xl font-semibold mb-6">Filters</h3>
              
              <div className="space-y-6">
                {/* Specialty Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Specialty</label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((spec, index) => (
                      <option key={index} value={spec._id}>
                        {spec._id} ({spec.count})
                      </option>
                    ))}
                  </select>
                </div>

                {/* City Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    placeholder="Enter city"
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                  />
                </div>

                {/* Video Consultation Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Consultation Type</label>
                  <select
                    value={filters.videoConsultationAvailable}
                    onChange={(e) => handleFilterChange('videoConsultationAvailable', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="">All Types</option>
                    <option value="true">Video Consultation Available</option>
                    <option value="false">In-Person Only</option>
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Min Experience (years)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 5"
                    value={filters.minExperience}
                    onChange={(e) => handleFilterChange('minExperience', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                  />
                </div>

                {/* Fee Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Max Fee</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g., 100"
                    value={filters.maxFee}
                    onChange={(e) => handleFilterChange('maxFee', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                    }`}
                  />
                </div>

                {/* Sort Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Sort By</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  >
                    <option value="rating">Highest Rating</option>
                    <option value="experience">Most Experience</option>
                    <option value="fee_low">Fee: Low to High</option>
                    <option value="fee_high">Fee: High to Low</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={clearFilters}
                    className={`flex-1 px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    Clear All
                  </button>
                  <button
                    onClick={fetchDoctors}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Doctors List */}
          <div className="lg:w-3/4">
            {/* Stats */}
            <div className={`mb-6 p-4 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="flex justify-between items-center">
                <h3 className={`text-xl font-semibold ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Available Doctors
                </h3>
                <span className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctors'} found
                </span>
              </div>
            </div>

            {/* Doctors Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className={`p-6 rounded-xl animate-pulse ${
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="flex items-center mb-4">
                      <div className={`w-16 h-16 rounded-full mr-4 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                      <div className="flex-1">
                        <div className={`h-4 rounded w-3/4 mb-2 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                        <div className={`h-3 rounded w-1/2 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                        }`}></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={`h-3 rounded w-full ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                      <div className={`h-3 rounded w-5/6 ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                      }`}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : doctors.length === 0 ? (
              <div className={`text-center py-12 rounded-xl ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className={`text-2xl font-semibold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  No Doctors Found
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  Try adjusting your filters or check back later
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor._id} 
                    className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${
                      theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        }`}>
                          {doctor.profilePicture ? (
                            <img 
                              src={doctor.profilePicture} 
                              alt={doctor.name}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          ) : (
                            <span className={`text-xl ${
                              theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                            }`}>
                              👨‍⚕️
                            </span>
                          )}
                        </div>
                        <div>
                          <h3 className={`font-bold text-lg ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            {doctor.name}
                          </h3>
                          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Experience
                          </span>
                          <span className={theme === 'dark' ? 'text-white' : 'text-gray-800'}>
                            {doctor.experience} years
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Fee
                          </span>
                          <span className={`font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            Rs.{doctor.consultationFee}
                          </span>
                        </div>
                        
                        {/* Video Consultation Indicator */}
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Consultation
                          </span>
                          <span className="flex items-center">
                            {doctor.videoConsultationAvailable ? (
                              <>
                                <span className="text-green-500 mr-1">🎥</span>
                                <span className="text-green-600 font-medium">Video Available</span>
                              </>
                            ) : (
                              <>
                                <span className="text-gray-400 mr-1">🏥</span>
                                <span className="text-gray-600">In-Person Only</span>
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex justify-between text-sm">
                          <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                            Rating
                          </span>
                          <span className="flex items-center">
                            ⭐ {doctor.rating?.toFixed(1) || 'N/A'}
                            {doctor.reviews > 0 && (
                              <span className="ml-1 text-xs">
                                ({doctor.reviews})
                              </span>
                            )}
                          </span>
                        </div>
                        {doctor.hospital?.address?.city && (
                          <div className="flex justify-between text-sm">
                            <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                              Location
                            </span>
                            <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                              {doctor.hospital.address.city}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex space-x-3">
                        <button
                          onClick={() => navigate(`/doctor/${doctor._id}`)}
                          className={`flex-1 text-center py-2 rounded-lg font-medium transition duration-300 ${
                            theme === 'dark' 
                              ? 'border border-gray-600 text-gray-300 hover:bg-gray-700' 
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => handleBookAppointment(doctor._id)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DoctorsPage;