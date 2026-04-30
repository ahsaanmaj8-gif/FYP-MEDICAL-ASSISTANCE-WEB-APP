import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const TermsPreview = () => {
  const { theme } = useContext(ThemeContext);

  const bgColor = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

  const termsHighlights = [
    {
      icon: "✓",
      title: "Acceptance of Terms",
      description: "By using MediCare, you agree to our terms and conditions"
    },
    {
      icon: "🔒",
      title: "Privacy Protection",
      description: "Your medical data is protected with industry-standard encryption"
    },
    {
      icon: "💰",
      title: "Fair Payment Policy",
      description: "Transparent pricing and refund policy for all services"
    },
    {
      icon: "⚕️",
      title: "Medical Disclaimer",
      description: "We connect you with doctors, but don't provide medical advice"
    }
  ];

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side - Terms Highlights */}
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                <span className="text-3xl">📜</span>
              </div>
              <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
                Terms & Conditions
              </h2>
              <p className={`text-lg ${subTextColor} mb-6`}>
                Understanding our policies helps us serve you better. Here are key highlights of our terms.
              </p>
              
              <div className="space-y-3 mb-6">
                {termsHighlights.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 text-sm flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${textColor}`}>{item.title}</h3>
                      <p className={`text-sm ${subTextColor}`}>{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/terms"
                className="inline-flex items-center gap-2 border-2 border-purple-600 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition duration-300"
              >
                Read Full Terms & Conditions
                <span>→</span>
              </Link>
            </div>

            {/* Right Side - Important Notice */}
            <div className={`p-6 rounded-2xl border ${borderColor} ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'}`}>
              <div className="flex items-start gap-4">
                <div className="text-3xl">⚠️</div>
                <div>
                  <h3 className={`text-xl font-bold ${textColor} mb-3`}>
                    Important Notice
                  </h3>
                  <ul className={`space-y-2 text-sm ${subTextColor}`}>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>All medical information is confidential and protected</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Consultations are between you and the healthcare provider</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>Payments are processed through secure gateways</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500">•</span>
                      <span>We reserve the right to update terms as needed</span>
                    </li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Last Updated: April 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TermsPreview;