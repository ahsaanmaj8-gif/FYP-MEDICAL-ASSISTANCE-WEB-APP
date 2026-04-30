import React, { useState, useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';

const FAQ = () => {
  const { theme } = useContext(ThemeContext);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqCategories = [
    {
      title: "📅 Appointments & Booking",
      icon: "📅",
      questions: [
        {
          q: "How do I book an appointment with a doctor?",
          a: "You can book an appointment by visiting our Doctors page, searching for a doctor by specialty or name, selecting an available time slot, and completing the booking process. You'll receive a confirmation via email and SMS."
        },
        {
          q: "Can I cancel or reschedule my appointment?",
          a: "Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time. Go to 'My Appointments' in your dashboard and click on the appointment you wish to modify."
        },
        {
          q: "What happens if I miss my appointment?",
          a: "If you miss an appointment without prior cancellation, it will be marked as 'No Show'. Please try to cancel at least 2 hours in advance to avoid any issues with future bookings."
        },
        {
          q: "How early should I arrive for an in-person appointment?",
          a: "Please arrive 15 minutes before your scheduled appointment time to complete any necessary paperwork and check-in process."
        }
      ]
    },
    {
      title: "💻 Video Consultation",
      icon: "🎥",
      questions: [
        {
          q: "How does video consultation work?",
          a: "After booking a video consultation, you'll receive a link. At the scheduled time, click the 'Join Video Call' button in your appointment details. The doctor will start the call, and you'll be connected via secure Jitsi Meet."
        },
        {
          q: "What do I need for a video consultation?",
          a: "You need a stable internet connection, a device with a camera and microphone (smartphone, tablet, or computer), and a quiet, private space for the consultation."
        },
        {
          q: "Is video consultation secure and private?",
          a: "Yes! We use HIPAA-compliant, end-to-end encrypted video technology to ensure your consultation remains private and secure."
        },
        {
          q: "What if I face technical issues during the call?",
          a: "You can refresh the page or rejoin using the same link. If problems persist, contact our support team at support@medicare.com for assistance."
        }
      ]
    },
    {
      title: "💰 Payments & Pricing",
      icon: "💰",
      questions: [
        {
          q: "What payment methods do you accept?",
          a: "We accept JazzCash (easy paisa), credit/debit cards, and cash on delivery for medicine orders. All payments are processed through secure gateways."
        },
        {
          q: "Is my payment information secure?",
          a: "Absolutely! We use industry-standard encryption and never store your complete payment details on our servers."
        },
        {
          q: "Can I get a refund if I cancel my appointment?",
          a: "Yes, full refund is available if cancelled at least 2 hours before the appointment. Cancellations within 2 hours may incur a small fee."
        },
        {
          q: "Why was I charged a consultation fee?",
          a: "The consultation fee covers the doctor's time and expertise. You pay only when your appointment is confirmed and before the consultation begins."
        }
      ]
    },
    {
      title: "💊 Medicines & Pharmacy",
      icon: "💊",
      questions: [
        {
          q: "Do I need a prescription to order medicines?",
          a: "Prescription medicines require a valid prescription uploaded during checkout. Over-the-counter (OTC) medicines can be ordered without a prescription."
        },
        {
          q: "How long does medicine delivery take?",
          a: "Delivery typically takes 2-4 hours for urgent orders and 24-48 hours for standard delivery, depending on your location and pharmacy availability."
        },
        {
          q: "Can I track my medicine order?",
          a: "Yes! You can track your order status in real-time from 'My Orders' section in your dashboard."
        },
        {
          q: "What if I receive damaged or wrong medicines?",
          a: "Contact our support team immediately with photos of the product. We'll arrange a free replacement or refund within 24 hours."
        }
      ]
    },
    {
      title: "🔬 Lab Tests",
      icon: "🔬",
      questions: [
        {
          q: "How do I book a lab test?",
          a: "Browse available tests on our Lab Tests page, select your preferred lab, choose home collection or lab visit, and complete the booking. You'll receive confirmation with details."
        },
        {
          q: "When will I get my test results?",
          a: "Test results are typically available within 24-72 hours, depending on the test type. You'll receive a notification when your report is ready for download."
        },
        {
          q: "Is home sample collection available?",
          a: "Yes, many labs offer home collection services. You can select this option during booking for an additional fee."
        },
        {
          q: "Are the labs verified and reliable?",
          a: "All partner labs are thoroughly verified and certified. We only work with NABL-accredited and ISO-certified laboratories."
        }
      ]
    },
    {
      title: "👨‍⚕️ For Doctors",
      icon: "👨‍⚕️",
      questions: [
        {
          q: "How can I join MediCare as a doctor?",
          a: "Click 'Sign Up' and select 'Doctor' role. Fill in your professional details, upload your license and certificates. Our team will verify your information within 2-3 business days."
        },
        {
          q: "How do I get paid for consultations?",
          a: "Earnings are deposited to your registered bank account monthly. You can track your earnings in the 'Earnings' section of your dashboard."
        },
        {
          q: "Can I set my own consultation fees?",
          a: "Yes, you can set your own consultation fees during registration and update them anytime from your profile settings."
        },
        {
          q: "How do I manage my availability?",
          a: "Use the 'Schedule' section in your dashboard to set working days, add or remove time slots, and mark holidays."
        }
      ]
    }
  ];

  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';
  const questionBg = theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-50';

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className={`text-4xl md:text-5xl font-bold ${textColor} mb-4`}>
            Frequently Asked Questions
          </h1>
          <p className={`text-lg ${subTextColor} max-w-2xl mx-auto`}>
            Find answers to common questions about our services, appointments, payments, and more.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <div key={catIndex} className={`rounded-2xl ${cardBg} border ${borderColor} overflow-hidden`}>
              <div className={`p-6 border-b ${borderColor}`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{category.icon}</span>
                  <h2 className={`text-2xl font-bold ${textColor}`}>{category.title}</h2>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {category.questions.map((faq, idx) => {
                  const globalIndex = `${catIndex}-${idx}`;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div key={idx}>
                      <button
                        onClick={() => toggleFAQ(globalIndex)}
                        className={`w-full text-left p-6 flex justify-between items-center ${questionBg} transition-all duration-300`}
                      >
                        <div className="flex-1 pr-4">
                          <h3 className={`text-lg font-semibold ${textColor}`}>{faq.q}</h3>
                        </div>
                        <div className={`text-2xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                          {isOpen ? '▼' : '▶'}
                        </div>
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
                        <div className={`p-6 pt-0 ${subTextColor} leading-relaxed`}>
                          <div className="border-l-4 border-green-500 pl-4">
                            {faq.a}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className={`mt-12 p-8 rounded-2xl text-center ${cardBg} border ${borderColor}`}>
          <div className="text-4xl mb-4">❓</div>
          <h2 className={`text-2xl font-bold ${textColor} mb-2`}>Still Have Questions?</h2>
          <p className={`${subTextColor} mb-6`}>Can't find the answer you're looking for? We're here to help!</p>
          <div className="flex flex-wrap gap-4 justify-center">
         
            <a 
              href="/contact"
              className="border border-green-600 text-green-600 px-6 py-3 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition inline-flex items-center gap-2"
            >
              💬 Live Chat
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQ;