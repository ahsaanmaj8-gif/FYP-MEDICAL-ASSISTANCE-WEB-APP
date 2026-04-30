import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { ThemeContext } from './../../context/ThemeContext';

const PublicLabTestsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTests();
    fetchCategories();
  }, [category, search]);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8085/api/v1/public/lab-tests', {
        params: { 
          category: category || undefined,
          search: search || undefined,
          limit: 20 
        }
      });
      
      if (response.data.success) {
        setTests(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching lab tests:', err);
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/v1/public/lab-tests?limit=100');
      if (response.data.success) {
        const uniqueCategories = [...new Set(response.data.data
          .map(t => t.category)
          .filter(Boolean))];
        setCategories(uniqueCategories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

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
    if (!category) return '🔬';
    
    const icons = {
      'blood': '🩸',
      'cholesterol': '📊',
      'hormone': '⚖️',
      'diabetes': '🩺',
      'liver': '🧬',
      'kidney': '💧',
      'urine': '🧪',
      'vitamin': '💊',
      'cardiac': '❤️',
      'thyroid': '🦋'
    };
    
    const lowerCat = category.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerCat.includes(key)) {
        return icon;
      }
    }
    return '🔬';
  };

  const bgColor = theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800';
  const cardBg = theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-gray-100 placeholder-gray-400 border-gray-600' : 'bg-white text-gray-800 placeholder-gray-500 border-gray-300';
  const featureBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';

  return (
    <div className={`min-h-screen ${bgColor}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-8 ${theme === 'dark' ? 'bg-gradient-to-r from-gray-800 to-gray-700' : 'bg-gradient-to-r from-purple-50 to-pink-50'}`}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Book Lab Tests
          </h1>
          <p className="text-lg mb-6">
            Get accurate diagnostic tests with home sample collection
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search lab tests..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-lg border ${inputBg}`}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${inputBg}`}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
            <button
              onClick={() => { setSearch(''); setCategory(''); }}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={`skeleton-${i}`} className={`p-6 rounded-xl animate-pulse ${cardBg}`}>
                <div className="w-16 h-16 rounded-full mx-auto mb-4 bg-gray-200"></div>
                <div className="h-4 rounded w-3/4 mx-auto mb-2 bg-gray-300"></div>
                <div className="h-3 rounded w-1/2 mx-auto mb-4 bg-gray-300"></div>
              </div>
            ))}
          </div>
        ) : tests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-2xl font-semibold mb-2">No Lab Tests Available</h3>
            <p>Check back later for available tests.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tests.map((test, index) => (
                <div 
                  key={`${test.testId}-${index}`}
                  className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${cardBg}`}
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">
                        {getTestIcon(test.category)}
                      </div>
                      <h3 className="font-bold text-lg mb-1">
                        {test.testName}
                      </h3>
                      <p className="text-sm">
                        {test.category || 'General Test'}
                      </p>
                    </div>
                    
                    <p className="text-sm mb-4">
                      {test.description || 'Comprehensive diagnostic test'}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-gray-700">{test.duration || '24-48 hours'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Lab:</span>
                        <span className="text-gray-700">{test.lab?.name || 'Partner Lab'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Home Collection:</span>
                        <span className={`font-medium ${
                          test.lab?.homeCollectionAvailable 
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}>
                          {test.lab?.homeCollectionAvailable ? 'Available' : 'Lab Visit'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xl">
                        {test.price || 'Contact for price'}
                      </span>
                      
                      <button
                        onClick={() => handleBookTest(test.lab?._id)}
                        className="px-4 py-2 rounded-lg font-medium transition duration-300 bg-purple-600 text-white hover:bg-purple-700"
                      >
                        Book Test
                      </button>
                    </div>
                    
                    {test.lab?.homeCollectionAvailable && (
                      <p className="text-xs mt-3 text-center text-green-600">
                        🏠 Home sample collection available
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show count */}
            <div className="mt-6 text-center text-gray-500">
              Showing {tests.length} tests
            </div>
          </>
        )}

        {/* Features Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl text-center ${featureBg}`}>
            <div className="text-3xl mb-3">🏠</div>
            <h4 className="font-bold text-lg mb-2">Home Collection</h4>
            <p>Get samples collected at your home by trained professionals</p>
          </div>
          <div className={`p-6 rounded-xl text-center ${featureBg}`}>
            <div className="text-3xl mb-3">📱</div>
            <h4 className="font-bold text-lg mb-2">Digital Reports</h4>
            <p>Get reports on your phone/email within promised time</p>
          </div>
          <div className={`p-6 rounded-xl text-center ${featureBg}`}>
            <div className="text-3xl mb-3">👨‍⚕️</div>
            <h4 className="font-bold text-lg mb-2">Free Consultation</h4>
            <p>Free report consultation with our doctors</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicLabTestsPage;
