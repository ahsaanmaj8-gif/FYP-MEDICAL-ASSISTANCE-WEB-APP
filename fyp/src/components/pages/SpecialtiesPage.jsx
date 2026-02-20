import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import axios from 'axios';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const SpecialtiesPage = () => {
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('count');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchSpecialties();
  }, []);

  const fetchSpecialties = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/public/specialties');
      
      if (response.data.success) {
        setSpecialties(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching specialties:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIconForSpecialty = (specialtyName) => {
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
      'Surgeon': '🔪',
      'Urologist': '💧',
      'Oncologist': '🩺',
      'Endocrinologist': '⚖️',
      'Gastroenterologist': '🌡️',
      'Pulmonologist': '🌬️',
      'Rheumatologist': '🦵',
      'Nephrologist': '🫀'
    };
    
    return iconMap[specialtyName] || '👨‍⚕️';
  };

  const filteredSpecialties = specialties
    .filter(spec => 
      spec._id.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count;
      if (sortBy === 'name') return a._id.localeCompare(b._id);
      if (sortBy === 'fee') return b.averageFee - a.averageFee;
      return 0;
    });

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-purple-900' 
            : 'bg-gradient-to-r from-purple-50 to-pink-50'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Medical Specialties
          </h1>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Browse through our comprehensive list of medical specialties and find the right doctor for your needs
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search specialties..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="count">Most Doctors</option>
              <option value="name">Alphabetical</option>
              <option value="fee">Highest Fee</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-4 rounded-xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {specialties.length}
            </div>
            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Specialties
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              {specialties.reduce((sum, spec) => sum + spec.count, 0)}
            </div>
            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Total Doctors
            </div>
          </div>
          <div className={`p-4 rounded-xl text-center ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-2xl font-bold mb-2 ${
              theme === 'dark' ? 'text-purple-400' : 'text-purple-600'
            }`}>
              ${Math.round(specialties.reduce((sum, spec) => sum + (spec.averageFee || 0), 0) / specialties.length) || 0}
            </div>
            <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Avg. Consultation Fee
            </div>
          </div>
        </div>

        {/* Specialties Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`p-6 rounded-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-3/4 mx-auto mb-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-3 rounded w-1/2 mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className="flex justify-center gap-4">
                  <div className={`h-4 rounded w-1/4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-4 rounded w-1/4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredSpecialties.length === 0 ? (
          <div className={`text-center py-12 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="text-6xl mb-4">👨‍⚕️</div>
            <h3 className="text-2xl font-semibold mb-2">No Specialties Found</h3>
            <p>Try adjusting your search term</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialties.map((specialty) => (
                <Link 
                  key={specialty._id}
                  to={`/doctors?specialty=${encodeURIComponent(specialty._id)}`}
                  className={`p-6 rounded-xl border-2 border-transparent transition duration-300 hover:shadow-xl ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700 hover:border-purple-500' 
                      : 'bg-white hover:bg-gray-50 hover:border-purple-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">
                      {getIconForSpecialty(specialty._id)}
                    </div>
                    <h3 className={`font-bold text-xl mb-3 ${
                      theme === 'dark' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {specialty._id}
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className={`text-lg font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {specialty.count}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Doctors
                        </div>
                      </div>
                      
                      <div className={`p-2 rounded-lg ${
                        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        <div className={`text-lg font-bold mb-1 ${
                          theme === 'dark' ? 'text-white' : 'text-gray-800'
                        }`}>
                          {specialty.averageRating ? specialty.averageRating.toFixed(1) : 'N/A'}
                        </div>
                        <div className={`text-xs ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          Avg Rating
                        </div>
                      </div>
                    </div>
                    
                    <div className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Avg. Fee: <span className="font-semibold">${Math.round(specialty.averageFee || 0)}</span>
                    </div>
                    
                    <div className="mt-4">
                      <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${
                        theme === 'dark' 
                          ? 'bg-purple-600 text-white hover:bg-purple-700' 
                          : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                      }`}>
                        View Doctors →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {/* Popular Specialties */}
            <div className="mt-12">
              <h2 className={`text-2xl font-bold mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Most Popular Specialties
              </h2>
              
              <div className="flex flex-wrap gap-3">
                {specialties
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((specialty) => (
                    <Link
                      key={specialty._id}
                      to={`/doctors?specialty=${encodeURIComponent(specialty._id)}`}
                      className={`px-4 py-2 rounded-full transition duration-300 ${
                        theme === 'dark' 
                          ? 'bg-gray-800 text-gray-300 hover:bg-purple-900 hover:text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-purple-100 hover:text-purple-800'
                      }`}
                    >
                      {specialty._id} ({specialty.count})
                    </Link>
                  ))}
              </div>
            </div>
          </>
        )}
        
        {/* Information Section */}
        <div className={`mt-12 p-6 rounded-xl ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <h3 className={`text-xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            How to Choose the Right Specialist?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Common Conditions
              </h4>
              <ul className={`space-y-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>• Heart issues → Cardiologist</li>
                <li>• Skin problems → Dermatologist</li>
                <li>• Child health → Pediatrician</li>
                <li>• Bone/joint pain → Orthopedic</li>
                <li>• Mental health → Psychiatrist</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-semibold mb-2 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Tips for Selection
              </h4>
              <ul className={`space-y-1 text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <li>• Check doctor experience and ratings</li>
                <li>• Consider consultation fees</li>
                <li>• Read patient reviews</li>
                <li>• Check availability in your area</li>
                <li>• Verify doctor qualifications</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SpecialtiesPage;