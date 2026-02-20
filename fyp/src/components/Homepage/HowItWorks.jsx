import React, { useContext } from 'react';
import { ThemeContext } from './../../context/ThemeContext';

const HowItWorks = () => {
  const { theme } = useContext(ThemeContext);

  const steps = [
    {
      number: '01',
      title: 'Search & Choose',
      description: 'Find the right doctor by specialty, experience, or rating',
      icon: '🔍'
    },
    {
      number: '02',
      title: 'Book Appointment',
      description: 'Select convenient date and time for consultation',
      icon: '📅'
    },
    {
      number: '03',
      title: 'Consult Doctor',
      description: 'Meet doctor in-person or via video consultation',
      icon: '👨‍⚕️'
    },
    {
      number: '04',
      title: 'Get Treatment',
      description: 'Receive prescription and follow-up care',
      icon: '💊'
    }
  ];

  return (
    <section className={`py-16 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            How It Works
          </h2>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Get quality healthcare in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className={`hidden lg:block absolute top-12 left-1/2 w-full h-0.5 -z-10 ${theme === 'dark' ? 'bg-blue-700' : 'bg-blue-200'}`}></div>
              )}

              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 relative ${
                theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'
              }`}>
                <span className="text-2xl">{step.icon}</span>
                <div className="absolute -top-2 -right-2 bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>

              <h3 className={`text-xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>{step.title}</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
