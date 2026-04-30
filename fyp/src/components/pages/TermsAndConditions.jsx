import React, { useContext, useState } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const TermsAndConditions = () => {
  const { theme } = useContext(ThemeContext);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const sectionBg = theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50';

  const sections = [
    {
      title: "1. Acceptance of Terms",
      icon: "✓",
      content: "By accessing or using MediCare platform, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service."
    },
    {
      title: "2. User Accounts",
      icon: "👤",
      content: "You must provide accurate, complete, and current information when creating an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
    },
    {
      title: "3. Medical Disclaimer",
      icon: "⚕️",
      content: "MediCare is a platform connecting patients with healthcare providers. We do not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional for medical concerns."
    },
    {
      title: "4. Appointments & Consultations",
      icon: "📅",
      content: "Appointments are subject to doctor availability. Cancellations must be made at least 2 hours before scheduled time. No-show appointments may be subject to charges."
    },
    {
      title: "5. Payments & Refunds",
      icon: "💰",
      content: "Consultation fees are paid before the appointment. Refunds for cancelled appointments are processed within 5-7 business days. Medicines ordered cannot be returned due to hygiene reasons."
    },
    {
      title: "6. Prescriptions & Medicines",
      icon: "💊",
      content: "You must upload valid prescriptions for prescription medicines. We verify prescriptions before processing orders. We are not liable for misuse of prescribed medications."
    },
    {
      title: "7. Lab Tests",
      icon: "🔬",
      content: "Test results are for informational purposes only. For critical results, consult with a doctor immediately. Home sample collection availability varies by location."
    },
    {
      title: "8. Privacy & Data Protection",
      icon: "🔒",
      content: "Your personal and medical information is protected under our Privacy Policy. We use industry-standard encryption to protect your data. We never share your information without consent."
    },
    {
      title: "9. User Conduct",
      icon: "📜",
      content: "You agree not to misuse the platform, harass providers, post false reviews, or attempt to hack or disrupt services. Violations may result in account termination."
    },
    {
      title: "10. Reviews & Ratings",
      icon: "⭐",
      content: "Reviews must be honest and based on actual experience. False or misleading reviews may be removed. We reserve the right to moderate all user-generated content."
    },
    {
      title: "11. Limitation of Liability",
      icon: "⚠️",
      content: "MediCare is not liable for indirect damages arising from use of our services. Our maximum liability is limited to the fees paid by you in the preceding 3 months."
    },
    {
      title: "12. Changes to Terms",
      icon: "📝",
      content: "We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of new terms."
    },
    {
      title: "13. Contact Information",
      icon: "📧",
      content: "For questions about these Terms, contact us at legal@medicare.com or call our support team at 1-800-MEDICARE."
    },
    {
      title: "14. Governing Law",
      icon: "⚖️",
      content: "These terms shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions."
    }
  ];

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <span className="text-5xl">📜</span>
          </div>
          <h1 className={`text-4xl md:text-5xl font-bold ${textColor} mb-4`}>
            Terms and Conditions
          </h1>
          <p className={`text-lg ${subTextColor} max-w-2xl mx-auto`}>
            Last Updated: April 2025
          </p>
          <p className={`text-sm ${subTextColor} mt-2`}>
            Please read these terms carefully before using MediCare platform
          </p>
        </div>

        {/* Quick Navigation */}
        <div className={`mb-8 p-6 rounded-2xl ${cardBg} border ${borderColor}`}>
          <h2 className={`text-lg font-semibold ${textColor} mb-4 flex items-center gap-2`}>
            <span>📑</span> Quick Navigation
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {sections.slice(0, 8).map((section, idx) => (
              <a
                key={idx}
                href={`#section-${idx}`}
                className={`text-sm ${subTextColor} hover:text-green-600 transition flex items-center gap-1`}
              >
                <span>{section.icon}</span> {section.title.split('.')[1]}
              </a>
            ))}
          </div>
        </div>

        {/* Terms Content */}
        <div className={`rounded-2xl ${cardBg} border ${borderColor} overflow-hidden`}>
          {/* Summary Banner */}
          <div className={`p-6 ${sectionBg} border-b ${borderColor}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">ℹ️</div>
              <div>
                <h3 className={`font-semibold ${textColor} mb-1`}>Summary</h3>
                <p className={`text-sm ${subTextColor}`}>
                  By using MediCare, you agree to these terms. We provide a platform connecting patients with healthcare providers.
                  Please review our policies on appointments, payments, privacy, and user conduct.
                </p>
              </div>
            </div>
          </div>

          {/* Terms Sections */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sections.map((section, idx) => (
              <div key={idx} id={`section-${idx}`} className="p-6 scroll-mt-20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-lg flex-shrink-0">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className={`text-xl font-bold ${textColor} mb-3`}>
                      {section.title}
                    </h2>
                    <p className={`${subTextColor} leading-relaxed`}>{section.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Acknowledgment Section */}
          <div className={`p-6 ${sectionBg} border-t ${borderColor}`}>
            <div className="flex items-start gap-3">
              <div className="text-2xl">✅</div>
              <div>
                <h3 className={`font-semibold ${textColor} mb-2`}>Acknowledgment</h3>
                <p className={`text-sm ${subTextColor} mb-4`}>
                  By using MediCare, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    🖨️ Print Terms
                  </button>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="flex items-center gap-2 text-sm text-green-600 hover:text-green-700"
                  >
                    🔝 Back to Top
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className={`mt-8 p-6 rounded-2xl text-center ${cardBg} border ${borderColor}`}>
          <div className="text-3xl mb-3">📧</div>
          <h3 className={`text-lg font-semibold ${textColor} mb-2`}>Questions About Terms?</h3>
          <p className={`text-sm ${subTextColor}`}>
            If you have any questions about these Terms & Conditions, please contact us:
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            <span className="text-green-600">📞 1-800-MEDICARE</span>
            <span className="text-green-600">✉️ legal@medicare.com</span>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsAndConditions;