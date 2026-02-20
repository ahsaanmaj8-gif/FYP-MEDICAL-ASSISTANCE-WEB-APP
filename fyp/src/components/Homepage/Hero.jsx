import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Health is Our <span className="text-yellow-300">Priority</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with the best doctors, book appointments, and get medical care from the comfort of your home
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/doctors" 
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition duration-300"
            >
              Find Doctors
            </Link>
            <Link 
              to="/video-consult" 
              className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition duration-300"
            >
              Video Consultation
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">5000+</div>
              <div className="text-blue-100">Verified Doctors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">1L+</div>
              <div className="text-blue-100">Happy Patients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-300">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;