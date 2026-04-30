import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const FAQPreview = () => {
  const { theme } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "How do I book an appointment with a doctor?",
      answer: "You can book an appointment by visiting our Doctors page, searching for a doctor by specialty or name, selecting an available time slot, and completing the booking process."
    },
    {
      question: "Is video consultation secure and private?",
      answer: "Yes! We use HIPAA-compliant, end-to-end encrypted video technology to ensure your consultation remains private and secure."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept JazzCash (easy paisa), credit/debit cards, and cash on delivery for medicine orders."
    },
    {
      question: "Do I need a prescription to order medicines?",
      answer: "Prescription medicines require a valid prescription uploaded during checkout. Over-the-counter (OTC) medicines can be ordered without a prescription."
    },
    {
      question: "How do I become a partner as a doctor/pharmacy/lab?",
      answer: "Click 'Sign Up' and select your role. Fill in your professional details, upload required documents. Our team will verify your information within 2-3 business days."
    }
  ];

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const questionBg = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100';

  return (
    <section className={`py-16 ${bgColor}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <span className="text-3xl">❓</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-4`}>
            Frequently Asked Questions
          </h2>
          <p className={`text-lg ${subTextColor} max-w-2xl mx-auto`}>
            Got questions? We've got answers. Here are some of the most common questions our users ask.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className={`rounded-xl border ${borderColor} overflow-hidden transition-all duration-300`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`w-full text-left p-5 flex justify-between items-center ${questionBg} transition-colors duration-300`}
                >
                  <div className="flex-1 pr-4">
                    <h3 className={`text-lg font-semibold ${textColor}`}>{faq.question}</h3>
                  </div>
                  <div className={`text-xl transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}>
                    {openIndex === index ? '▼' : '▶'}
                  </div>
                </button>
                
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-40' : 'max-h-0'}`}>
                  <div className={`p-5 pt-0 ${subTextColor} leading-relaxed`}>
                    <div className="border-l-4 border-green-500 pl-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All FAQs Button */}
          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300"
            >
              View All FAQs
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQPreview;