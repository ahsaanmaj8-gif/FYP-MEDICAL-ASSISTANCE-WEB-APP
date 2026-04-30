import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const AboutPage = () => {
  const { theme } = useContext(ThemeContext);

  const stats = [
    { number: '5000+', label: 'Verified Doctors' },
    { number: '100K+', label: 'Happy Patients' },
    { number: '50+', label: 'Cities' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-12 ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-blue-900' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            About MediCare
          </h1>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your trusted partner in healthcare. We connect patients with the best medical professionals.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl text-center ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`text-3xl font-bold mb-2 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {stat.number}
              </div>
              <div className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Our Mission
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              To make quality healthcare accessible and affordable for everyone. We believe that everyone deserves access to good healthcare, regardless of their location or financial situation.
            </p>
          </div>
          
          <div className={`p-6 rounded-xl ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-800'
            }`}>
              Our Vision
            </h2>
            <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              To revolutionize healthcare delivery through technology, making it more efficient, transparent, and patient-centric.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold mb-8 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Our Values
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-3xl mb-4">🤝</div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Patient First
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Every decision we make is focused on patient well-being and satisfaction.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-3xl mb-4">🔒</div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Trust & Transparency
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                We maintain complete transparency in our operations and pricing.
              </p>
            </div>
            
            <div className={`p-6 rounded-xl ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className="text-3xl mb-4">💡</div>
              <h3 className={`font-bold  text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Innovation
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Continuously innovating to improve healthcare delivery through technology.
              </p>
            </div>
          </div>
        </div>

      
      
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;