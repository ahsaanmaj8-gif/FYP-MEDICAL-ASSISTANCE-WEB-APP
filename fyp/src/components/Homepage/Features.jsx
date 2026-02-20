import React, { useContext } from 'react';
import { ThemeContext } from './../../context/ThemeContext';

const Features = () => {
  const { theme } = useContext(ThemeContext);

  const features = [
    {
      icon: '👨‍⚕️',
      title: 'Expert Doctors',
      description: 'Verified and experienced medical professionals'
    },
    {
      icon: '💻',
      title: 'Video Consultation',
      description: 'Consult doctors from home via secure video calls'
    },
    {
      icon: '📱',
      title: 'Easy Booking',
      description: 'Book appointments in just a few clicks'
    },
    {
      icon: '🏥',
      title: '100+ Specialties',
      description: 'Comprehensive healthcare specialties covered'
    },
    {
      icon: '💊',
      title: 'Medicine Delivery',
      description: 'Get medicines delivered to your doorstep'
    },
    {
      icon: '🔬',
      title: 'Lab Tests',
      description: 'Home sample collection and online reports'
    }
  ];

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Why Choose MediCare?
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            We provide comprehensive healthcare solutions that put your well-being first
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {feature.title}
              </h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
