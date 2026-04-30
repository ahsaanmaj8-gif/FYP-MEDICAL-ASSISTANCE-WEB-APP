import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

const Hero = () => {
  const { theme } = useContext(ThemeContext);
  const [stats, setStats] = useState({
    verifiedDoctors: 0,
    happyPatients: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:8085/api/v1/public/stats');
      
      if (response.data.success) {
        setStats({
          verifiedDoctors: response.data.data.verifiedDoctors || 0,
          happyPatients: response.data.data.happyPatients || 0,
          activeUsers: response.data.data.activeUsers || 0
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback to default values if API fails
      setStats({
        verifiedDoctors: 1250,
        happyPatients: 50000,
        activeUsers: 12500
      });
    } finally {
      setLoading(false);
    }
  };

  // Format large numbers (1000 → 1K, 1000000 → 1M)
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M+';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K+';
    }
    return num + '+';
  };

  // Dynamic gradient based on theme
  const gradientClass = theme === 'dark' 
    ? 'from-gray-800 to-gray-900' 
    : 'from-blue-600 to-purple-700';

  // Dynamic text colors based on theme
  const textColor = theme === 'dark' ? 'text-gray-100' : 'text-white';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-blue-100';
  const statTextColor = theme === 'dark' ? 'text-yellow-400' : 'text-yellow-300';
  const statLabelColor = theme === 'dark' ? 'text-gray-300' : 'text-blue-100';
  
  // Button styles based on theme
  const primaryBtnClass = theme === 'dark'
    ? 'bg-gray-700 text-gray-100 hover:bg-gray-600 border border-gray-600'
    : 'bg-white text-blue-600 hover:bg-gray-100';
  
  const secondaryBtnClass = theme === 'dark'
    ? 'border-2 border-gray-500 text-gray-100 hover:bg-gray-700 hover:text-white'
    : 'border-2 border-white text-white hover:bg-white hover:text-blue-600';

  if (loading) {
    return (
      <section className={`bg-gradient-to-r ${gradientClass} py-20`}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${textColor}`}>
              Your Health is Our <span className={statTextColor}>Priority</span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${subTextColor}`}>
              Connect with the best doctors, book appointments, and get medical care from the comfort of your home
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className={`px-8 py-4 rounded-full h-14 w-36 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} animate-pulse`}></div>
              <div className={`px-8 py-4 rounded-full h-14 w-44 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white/20'} animate-pulse`}></div>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="text-center">
                  <div className={`h-8 w-24 rounded-full mx-auto animate-pulse mb-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-400/30'}`}></div>
                  <div className={`h-4 w-20 rounded-full mx-auto animate-pulse ${theme === 'dark' ? 'bg-gray-700' : 'bg-blue-400/20'}`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`bg-gradient-to-r ${gradientClass} py-20 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className={`text-4xl md:text-6xl font-bold mb-6 ${textColor}`}>
            Your Health is Our <span className={statTextColor}>Priority</span>
          </h1>
          <p className={`text-xl md:text-2xl mb-8 ${subTextColor}`}>
            Connect with the best doctors, book appointments, and get medical care from the comfort of your home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/doctors" 
              className={`px-8 py-4 rounded-full font-semibold text-lg transition duration-300 ${primaryBtnClass}`}
            >
              Find Doctors
            </Link>
            <Link 
              to="/video-consult" 
              className={`px-8 py-4 rounded-full font-semibold text-lg transition duration-300 ${secondaryBtnClass}`}
            >
              Video Consultation
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className={`text-3xl font-bold ${statTextColor}`}>
                {formatNumber(stats.verifiedDoctors)}
              </div>
              <div className={statLabelColor}>Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${statTextColor}`}>
                {formatNumber(stats.happyPatients)}
              </div>
              <div className={statLabelColor}>Happy Patients</div>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${statTextColor}`}>
                {stats.activeUsers > 0 ? formatNumber(stats.activeUsers) : '24/7'}
              </div>
              <div className={statLabelColor}>
                {stats.activeUsers > 0 ? 'Active Users' : 'Support Available'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;