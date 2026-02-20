import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from './../../context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const LabTestsSection = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);


  const navigate = useNavigate();
  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/public/lab-tests', {
        params: { limit: 6 }
      });
      
      if (response.data.success) {
        setTests(response.data.data);
      } else {
        setError('Failed to load lab tests');
      }
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      setError('Error loading tests');
      setTests(getSampleTests());
    } finally {
      setLoading(false);
    }
  };

  const getSampleTests = () => [
    {
      testId: '1',
      testName: 'Complete Blood Count (CBC)',
      category: 'Blood Test',
      price: 25.99,
      duration: '24 hours',
      description: 'Measures different components of blood',
      lab: {
        name: 'City Lab',
        homeCollectionAvailable: true
      }
    },
    {
      testId: '2',
      testName: 'Lipid Profile',
      category: 'Cholesterol',
      price: 35.50,
      duration: '48 hours',
      description: 'Measures cholesterol and triglycerides',
      lab: {
        name: 'Health Diagnostics',
        homeCollectionAvailable: true
      }
    },
    {
      testId: '3',
      testName: 'Thyroid Function Test',
      category: 'Hormone',
      price: 42.75,
      duration: '24 hours',
      description: 'Measures thyroid hormone levels',
      lab: {
        name: 'MediLab',
        homeCollectionAvailable: false
      }
    }
  ];


  const handleBookTest = (labId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book a test');
      navigate('/login', { state: { from: `/lab-tests/book/${labId}` } });
      return;
    }
    navigate(`/lab-tests/book/${labId}`);
  };



  const getTestIcon = (category) => {
    const icons = {
      'Blood Test': '🩸',
      'Cholesterol': '📊',
      'Hormone': '⚖️',
      'Diabetes': '🩺',
      'Liver': '🧬',
      'Kidney': '💧',
      'Urine': '🧪',
      'Vitamin': '💊'
    };
    return icons[category] || '🔬';
  };

  if (loading) {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Book Lab Tests
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Loading tests...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-6 rounded-xl shadow-md animate-pulse ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-3/4 mx-auto mb-2 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className={`h-3 rounded w-1/2 mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className="flex justify-between">
                  <div className={`h-4 rounded w-1/4 ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-8 rounded w-1/3 ${
                    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>
            ))}
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
              Book Lab Tests
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Get accuratee diagnostic tests with home sample collection
            </p>
          </div>
          <Link 
            to="/lab-tests" 
            className={`hidden md:block border-2 px-6 py-3 rounded-full font-semibold transition duration-300 ${
              theme === 'dark' 
                ? 'border-purple-400 text-purple-400 hover:bg-purple-900 hover:text-white' 
                : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
            }`}
          >
            View All Tests
          </Link>
        </div>

        {error && tests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchLabTests}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tests.slice(0, 3).map((test) => (
                <div 
                  key={test.testId} 
                  className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white'
                  }`}
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">
                        {getTestIcon(test.category)}
                      </div>
                      <h3 className={`font-semibold text-lg mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {test.testName}
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {test.category}
                      </p>
                    </div>
                    
                    <p className={`text-sm mb-4 ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {test.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Duration
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {test.duration}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Lab
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {test.lab?.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Home Collection
                        </span>
                        <span className={`font-medium ${
                          test.lab?.homeCollectionAvailable 
                            ? theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            : theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>
                          {test.lab?.homeCollectionAvailable ? 'Available' : 'Lab Visit'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-xl ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        ${test.price}
                      </span>
                      





                      <button
                        onClick={() => handleBookTest(test.lab?._id)}
                        className="px-4 py-2 rounded-lg font-medium transition duration-300 bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Book Test
                      </button>
                      {/* <Link 
                        to={`/lab-tests/book/${test.testId}`}
                        className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                          theme === 'dark' 
                            ? 'bg-purple-600 text-white hover:bg-purple-700' 
                            : 'bg-purple-600 text-white hover:bg-purple-700'
                        }`}
                      >
                        Book Test
                      </Link> */}
                    </div>
                    
                    {test.lab?.homeCollectionAvailable && (
                      <p className={`text-xs mt-3 text-center ${
                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                      }`}>
                        🏠 Home sample collection available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link 
                to="/lab-tests" 
                className={`inline-block border-2 px-8 py-3 rounded-full font-semibold transition duration-300 ${
                  theme === 'dark' 
                    ? 'border-purple-400 text-purple-400 hover:bg-purple-900 hover:text-white' 
                    : 'border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white'
                }`}
              >
                View All Tests
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-2xl mb-2">🏠</div>
                <h4 className={`font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Home Collection
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Get samples collected at your home
                </p>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-2xl mb-2">📱</div>
                <h4 className={`font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Online Reports
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Get reports on your phone/email
                </p>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <div className="text-2xl mb-2">👨‍⚕️</div>
                <h4 className={`font-semibold mb-1 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  Doctor Consultation
                </h4>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Free report consultation available
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LabTestsSection;