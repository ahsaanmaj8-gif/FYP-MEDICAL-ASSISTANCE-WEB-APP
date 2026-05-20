import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { Backend_Url } from './../../../utils/utils';

const PublicPharmacyPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const { theme } = useContext(ThemeContext);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [category, search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Backend_Url}/public/pharmacy-products`, {
        params: { 
          category: category || undefined,
          search: search || undefined,
          limit: 20 
        }
      });
      
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${Backend_Url}/public/pharmacy-products`);
      const uniqueCategories = [...new Set(response.data.data.map(p => p.category))].filter(Boolean);
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleOrderClick = (product) => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: `/pharmacy/product/${product._id}` } });
      return;
    }
    
    if (product.prescriptionRequired) {
      alert('This medicine requires a prescription. Please upload your prescription.');
      // Navigate to prescription upload page
    } else {
      navigate(`/pharmacy/order/${product._id}`);
    }
  };

  const getMedicineIcon = (type) => {
    const icons = {
      'tablet': '💊',
      'capsule': '🔴',
      'syrup': '🥤',
      'injection': '💉',
      'ointment': '🧴',
      'drops': '💧',
      'inhaler': '🌬️'
    };
    return icons[type] || '💊';
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-8 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-green-900' 
            : 'bg-gradient-to-r from-green-50 to-blue-50'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Pharmacy & Medicines
          </h1>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Order prescribed medicines and get them delivered to your doorstep
          </p>
          
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search medicines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`flex-1 px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              }`}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`px-4 py-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
            >
              <option value="">All Categories</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className={`p-4 rounded-xl animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div className={`w-full h-48 rounded-lg mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className={`h-4 rounded w-3/4 mb-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-3 rounded w-1/2 mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className={`text-center py-12 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            <div className="text-6xl mb-4">💊</div>
            <h3 className="text-2xl font-semibold mb-2">No Medicines Available</h3>
            <p>Check back later for available medicines.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className={`rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="p-4">
                    <div className="text-center mb-4">
                      <div className="text-5xl mb-3">
                        {getMedicineIcon(product.type)}
                      </div>
                      <h3 className={`font-bold text-lg mb-1 ${
                        theme === 'dark' ? 'text-white' : 'text-gray-800'
                      }`}>
                        {product.name}
                      </h3>
                      <p className={`text-sm ${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {product.genericName || product.brand}
                      </p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Strength:
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.strength}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Category:
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.category}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Type:
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.type}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-3">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <span className={`line-through text-sm ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              Rs.{product.price}
                            </span>
                            <span className={`ml-2 font-bold text-xl ${
                              theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`}>
                              {(product.price * (100 - product.discount) / 100).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <span className={`font-bold text-xl ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                           Rs. {product.price}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleOrderClick(product)}
                        className={`px-4 py-2 rounded-lg font-medium transition duration-300 ${
                          product.prescriptionRequired
                            ? theme === 'dark'
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                            : theme === 'dark'
                              ? 'bg-green-600 text-white hover:bg-green-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {product.prescriptionRequired ? 'Prescription' : 'Order Now'}
                      </button>
                    </div>
                    
                    {product.stock < 10 && (
                      <p className={`text-xs text-center ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        ⚠️ Only {product.stock} left in stock
                      </p>
                    )}
                    
                    {product.discount > 0 && (
                      <div className={`text-xs text-center mt-2 px-2 py-1 rounded-full ${
                        theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                      }`}>
                        {product.discount}% OFF
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default PublicPharmacyPage;