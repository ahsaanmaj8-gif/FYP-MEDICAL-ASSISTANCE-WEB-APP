import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from './../../context/ThemeContext';
import axios from 'axios';

const TopDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/public/featured-doctors');
      
      if (response.data.success) {
        setDoctors(response.data.data);
      } else {
        setError('Failed to load doctors');
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      setError('Error loading doctors. Please try again.');
      // Fallback to sample data if API fails
      setDoctors(getSampleDoctors());
    } finally {
      setLoading(false);
    }
  };

  // Fallback sample data
  const getSampleDoctors = () => [
    {
      _id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Cardiologist',
      experience: 15,
      rating: 4.9,
      reviews: 284,
      consultationFee: 50,
      hospital: 'City General Hospital',
      city: 'New York'
    },
    {
      _id: '2',
      name: 'Dr. Michael Chen',
      specialization: 'Neurologist',
      experience: 12,
      rating: 4.8,
      reviews: 196,
      consultationFee: 45,
      hospital: 'Neuro Care Center',
      city: 'California'
    },
    {
      _id: '3',
      name: 'Dr. Priya Sharma',
      specialization: 'Dermatologist',
      experience: 10,
      rating: 4.7,
      reviews: 172,
      consultationFee: 40,
      hospital: 'Skin Care Clinic',
      city: 'Texas'
    }
  ];

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Top Doctors
            </h2>
            <p className="text-gray-600 mb-8">Loading doctors...</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-md p-6 animate-pulse">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error && doctors.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Top Doctors
            </h2>
            <p className="text-red-500 mb-4">{error}</p>
            <Link 
              to="/doctors" 
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              View All Doctors
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Our Top Doctors
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Highly rated and experienced medical professionals
            </p>
          </div>
          <Link 
            to="/doctors" 
            className={`hidden md:block border-2 px-6 py-3 rounded-full font-semibold transition duration-300 ${
              theme === 'dark' 
                ? 'border-blue-400 text-blue-400 hover:bg-blue-900 hover:text-white' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            View All Doctors
          </Link>
        </div>

        {doctors.length === 0 ? (
          <div className="text-center py-8">
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              No doctors available at the moment. Please check back later.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doctors.slice(0, 3).map((doctor) => (
              <div 
                key={doctor._id} 
                className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                    }`}>
                      {doctor.profilePicture ? (
                        <img 
                          src={doctor.profilePicture} 
                          alt={doctor.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <span className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                          👨‍⚕️
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold text-lg ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {doctor.name}
                      </h3>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                        {doctor.specialization}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        Experience
                      </span>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {doctor.experience} years
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                        Consultation Fee
                      </span>
                      <span className={`font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        Rs.{doctor.consultationFee}
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
                            ({doctor.reviews} reviews)
                          </span>
                        )}
                      </span>
                    </div>
                    {doctor.city && (
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Location
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
                          {doctor.city}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-3">
                    <Link 
                      to={`/doctor/${doctor._id}`}
                      className={`flex-1 text-center py-2 rounded-lg font-semibold transition duration-300 ${
                        theme === 'dark' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/book-appointment/${doctor._id}`}
                      className={`flex-1 border text-center py-2 rounded-lg font-semibold transition duration-300 ${
                        theme === 'dark' 
                          ? 'border-blue-400 text-blue-400 hover:bg-blue-900 hover:text-white' 
                          : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                      }`}
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8 md:hidden">
          <Link 
            to="/doctors" 
            className={`inline-block border-2 px-8 py-3 rounded-full font-semibold transition duration-300 ${
              theme === 'dark' 
                ? 'border-blue-400 text-blue-400 hover:bg-blue-900 hover:text-white' 
                : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
            }`}
          >
            View All Doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopDoctors;