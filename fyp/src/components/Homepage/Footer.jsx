import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="text-xl font-bold">MediCare</span>
            </Link>
            <p className="text-gray-400 mb-4">
              Your trusted partner in healthcare. Connecting patients with the best medical professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">FB</a>
              <a href="#" className="text-gray-400 hover:text-white">TW</a>
              <a href="#" className="text-gray-400 hover:text-white">IG</a>
              <a href="#" className="text-gray-400 hover:text-white">LI</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/doctors" className="text-gray-400 hover:text-white">Find Doctors</Link></li>
              <li><Link to="/video-consult" className="text-gray-400 hover:text-white">Video Consultation</Link></li>
              <li><Link to="/pharmacy" className="text-gray-400 hover:text-white">Medicine Delivery</Link></li>
              <li><Link to="/lab-tests" className="text-gray-400 hover:text-white">Lab Tests</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
               <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
    <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <ul className="space-y-2 text-gray-400">
              <li>📞 0300 1234XXX</li>
              <li>✉️ support_ahsaan@medicare.com</li>
              <li>📍 26 Hunza block Allama Iqbal Town Lahore</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 MediCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;