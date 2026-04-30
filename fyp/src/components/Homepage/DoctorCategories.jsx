import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from './../../context/ThemeContext';
import axios from 'axios';

const DoctorCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/public/specialties');
      
      if (response.data.success) {
        // Take top 8 specialties
        setCategories(response.data.data.slice(0, 8).map(spec => ({
          name: spec._id,
          doctors: spec.count,
          averageFee: spec.averageFee,
          icon: getIconForSpecialty(spec._id)
        })));
      } else {
        setError('Failed to load specialties');
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
      setError('Error loading specialties');
      // Fallback to sample data
      setCategories(getSampleCategories());
    } finally {
      setLoading(false);
    }
  };

  const getIconForSpecialty = (specialty) => {
    const iconMap = {
      'Cardiologist': '❤️',
      'Dermatologist': '🧴',
      'Neurologist': '🧠',
      'Pediatrician': '👶',
      'Orthopedic': '🦴',
      'Dentist': '🦷',
      'Psychiatrist': '🧘',
      'Gynecologist': '🌸',
      'General Physician': '👨‍⚕️',
      'ENT Specialist': '👂',
      'Eye Specialist': '👁️',
      'Surgeon': '🔪'
    };
    
    return iconMap[specialty] || '👨‍⚕️';
  };

  // Fallback sample data
  const getSampleCategories = () => [
    { name: 'Cardiologist', icon: '❤️', doctors: 250 },
    { name: 'Dermatologist', icon: '🧴', doctors: 180 },
    { name: 'Neurologist', icon: '🧠', doctors: 120 },
    { name: 'Pediatrician', icon: '👶', doctors: 300 },
    { name: 'Orthopedic', icon: '🦴', doctors: 150 },
    { name: 'Dentist', icon: '🦷', doctors: 200 },
    { name: 'Psychiatrist', icon: '🧘', doctors: 90 },
    { name: 'Gynecologist', icon: '🌸', doctors: 170 }
  ];

  if (loading) {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Find Doctors by Specialty
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Loading specialties...
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`p-6 rounded-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <div className={`w-12 h-12 rounded-full mx-auto mb-3 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-3/4 mx-auto mb-2 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className={`h-3 rounded w-1/2 mx-auto ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Find Doctors by Specialty
          </h2>
          <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600 text-lg'}>
            Browse through our wide range of medical specialties
          </p>
        </div>

        {error && categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchSpecialties}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map((category, index) => (
                <Link 
                  key={index}
                  to={`/doctors?specialty=${encodeURIComponent(category.name)}`}
                  className={`p-6 rounded-xl text-center border-2 border-transparent transition duration-300 group ${
                    theme === 'dark' 
                      ? 'bg-gray-700 hover:bg-gray-600 hover:border-blue-500' 
                      : 'bg-gray-50 hover:bg-blue-50 hover:border-blue-200'
                  }`}
                >
                  <div className="text-3xl mb-3 group-hover:scale-110 transition duration-300">
                    {category.icon}
                  </div>
                  <h3 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-white' : 'text-gray-800'
                  }`}>
                    {category.name}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {category.doctors}+ Doctors
                  </p>
                  {category.averageFee && (
                    <p className={`text-xs mt-1 ${
                      theme === 'dark' ? 'text-gray-500' : 'text-gray-600'
                    }`}>
                      Avg: Rs.{Math.round(category.averageFee)}
                    </p>
                  )}
                </Link>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link 
                to="/specialties" 
                className={`inline-block border-2 px-8 py-3 rounded-full font-semibold transition duration-300 ${
                  theme === 'dark' 
                    ? 'border-blue-400 text-blue-400 hover:bg-blue-900 hover:text-white' 
                    : 'border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
                }`}
              >
                View All Specialties
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default DoctorCategories;