import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from './../../context/ThemeContext';
import axios from 'axios';

const PharmacySection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      // Use public endpoint for featured medicines
      const response = await axios.get('http://localhost:8085/api/v1/public/medicines/featured', {
        params: { limit: 3 }
      });
      
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        setError('Failed to load products');
        setProducts(getSampleProducts()); // Fallback to sample data
      }
    } catch (err) {
      console.error('Error fetching pharmacy products:', err);
      setError('Error loading products');
      setProducts(getSampleProducts()); // Fallback to sample data
    } finally {
      setLoading(false);
    }
  };

  const getSampleProducts = () => [
    {
      _id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      brand: 'Generic',
      type: 'tablet',
      strength: '500mg',
      price: 5.99,
      discount: 0,
      stock: 100,
      category: 'Pain Relief',
      prescriptionRequired: false
    },
    {
      _id: '2',
      name: 'Amoxicillin 250mg',
      genericName: 'Amoxicillin',
      brand: 'Generic',
      type: 'capsule',
      strength: '250mg',
      price: 12.99,
      discount: 10,
      stock: 50,
      category: 'Antibiotic',
      prescriptionRequired: true
    },
    {
      _id: '3',
      name: 'Cetirizine 10mg',
      genericName: 'Cetirizine',
      brand: 'Zyrtec',
      type: 'tablet',
      strength: '10mg',
      price: 8.49,
      discount: 5,
      stock: 75,
      category: 'Allergy',
      prescriptionRequired: false
    }
  ];

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

  // Handle order button click
  const handleOrderClick = (productId, requiresPrescription) => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token && requiresPrescription) {
      // Redirect to login for prescription medicines
      window.location.href = '/login?redirect=/pharmacy';
    } else if (!token) {
      // Redirect to login for non-prescription medicines
      window.location.href = '/login?redirect=/pharmacy';
    } else {
      // Navigate to product page or order page
      window.location.href = `/pharmacy/order/${productId}`;
    }
  };

  if (loading) {
    return (
      <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Get Medicines Delivered
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Loading medicines...
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className={`p-6 rounded-xl shadow-md animate-pulse ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <div className={`w-16 h-16 rounded-full mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-4 rounded w-3/4 mx-auto mb-2 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className={`h-3 rounded w-1/2 mx-auto mb-4 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}></div>
                <div className="flex justify-between">
                  <div className={`h-4 rounded w-1/4 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                  }`}></div>
                  <div className={`h-8 rounded w-1/3 ${
                    theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
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
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Get Medicines Delivered
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Order prescribed medicines and get them delivered to your doorstep
            </p>
          </div>
          <Link 
            to="/pharmacy" 
            className={`hidden md:block border-2 px-6 py-3 rounded-full font-semibold transition duration-300 ${
              theme === 'dark' 
                ? 'border-green-400 text-green-400 hover:bg-green-900 hover:text-white' 
                : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
            }`}
          >
            View All Medicines
          </Link>
        </div>

        {error && products.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={fetchFeaturedProducts}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ${
                    theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-white'
                  }`}
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <div className="text-4xl mb-2">
                        {getMedicineIcon(product.type)}
                      </div>
                      <h3 className={`font-semibold text-lg mb-1 ${
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
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Type
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.type}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Strength
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.strength}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>
                          Category
                        </span>
                        <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                          {product.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        {product.discount > 0 ? (
                          <>
                            <span className={`line-through text-sm ${
                              theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                            }`}>
                              ${product.price}
                            </span>
                            <span className={`ml-2 font-bold ${
                              theme === 'dark' ? 'text-green-400' : 'text-green-600'
                            }`}>
                              ${(product.price * (100 - product.discount) / 100).toFixed(2)}
                            </span>
                            <span className={`ml-2 text-xs ${
                              theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                            } px-2 py-1 rounded-full`}>
                              {product.discount}% OFF
                            </span>
                          </>
                        ) : (
                          <span className={`font-bold ${
                            theme === 'dark' ? 'text-white' : 'text-gray-800'
                          }`}>
                            ${product.price}
                          </span>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleOrderClick(product._id, product.prescriptionRequired)}
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
                    
                    {product.stock < 20 && (
                      <p className={`text-xs mt-3 text-center ${
                        theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'
                      }`}>
                        ⚠️ Only {product.stock} left in stock
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8 md:hidden">
              <Link 
                to="/pharmacy" 
                className={`inline-block border-2 px-8 py-3 rounded-full font-semibold transition duration-300 ${
                  theme === 'dark' 
                    ? 'border-green-400 text-green-400 hover:bg-green-900 hover:text-white' 
                    : 'border-green-600 text-green-600 hover:bg-green-600 hover:text-white'
                }`}
              >
                View All Medicines
              </Link>
            </div>
            
            <div className="mt-12 text-center">
              <div className={`inline-flex items-center space-x-2 px-6 py-3 rounded-full ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <span className={theme === 'dark' ? 'text-green-400' : 'text-green-600'}>🚚</span>
                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                  Free delivery on orders above $50
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PharmacySection;