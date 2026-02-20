import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const VideoConsultPage = () => {
  const { theme } = useContext(ThemeContext);

  const features = [
    {
      icon: '🎥',
      title: 'HD Video Call',
      description: 'High-quality video consultation with doctors'
    },
    {
      icon: '📱',
      title: 'Easy to Use',
      description: 'Join consultation with single click, no app needed'
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'End-to-end encrypted, HIPAA compliant'
    },
    {
      icon: '💳',
      title: 'Easy Payment',
      description: 'Pay online, get instant appointment confirmation'
    },
    {
      icon: '📝',
      title: 'Digital Prescription',
      description: 'Get e-prescription after consultation'
    },
    {
      icon: '💊',
      title: 'Medicine Delivery',
      description: 'Get prescribed medicines delivered at home'
    }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className={`rounded-2xl p-8 mb-12 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-blue-900' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50'
        }`}>
          <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Video Consultation
          </h1>
          <p className={`text-xl mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Consult doctors from the comfort of your home
          </p>
          
          <Link 
            to="/doctors" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Book Video Consultation
          </Link>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            How Video Consultation Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                1️⃣
              </div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Choose Doctor
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Select doctor and time slot
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                2️⃣
              </div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Make Payment
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Pay consultation fee online
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                3️⃣
              </div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Join Call
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Click link to join video call
              </p>
            </div>
            
            <div className="text-center">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ${
                theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100'
              }`}>
                4️⃣
              </div>
              <h3 className={`font-bold text-lg mb-2 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}>
                Get Prescription
              </h3>
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                Receive digital prescription
              </p>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className={`text-3xl font-bold mb-8 text-center ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Why Choose Video Consultation?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                } transition duration-300`}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className={`font-bold text-lg mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-800'
                }`}>
                  {feature.title}
                </h3>
                <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className={`rounded-2xl p-8 text-center ${
          theme === 'dark' 
            ? 'bg-gradient-to-r from-gray-800 to-green-900' 
            : 'bg-gradient-to-r from-green-50 to-blue-50'
        }`}>
          <h2 className={`text-3xl font-bold mb-4 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            Ready for Your Consultation?
          </h2>
          <p className={`text-lg mb-6 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Connect with our verified doctors in minutes
          </p>
          <Link 
            to="/doctors" 
            className="inline-block bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition duration-300"
          >
            Find Doctors Now
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VideoConsultPage;