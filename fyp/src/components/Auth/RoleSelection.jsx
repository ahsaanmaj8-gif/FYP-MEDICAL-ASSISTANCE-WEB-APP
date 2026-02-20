import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelection = () => {
  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      icon: '👤',
      description: 'Book appointments, consult doctors, manage health records',
      color: 'blue'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      icon: '👨‍⚕️',
      description: 'Join as healthcare provider, manage patients, provide consultations',
      color: 'green'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      icon: '💊',
      description: 'Register your pharmacy, sell medicines, manage inventory',
      color: 'purple'
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      icon: '🔬',
      description: 'Register your lab, offer tests, manage sample collections',
      color: 'orange'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <Link to="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          <span className="text-3xl font-bold text-gray-900">MediCare</span>
        </Link>
        
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Join MediCare</h2>
          <p className="text-xl text-gray-600">Choose your role to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => (
            <Link
              key={role.id}
              to={`/signup/${role.id}`}
              className="block p-8 bg-white border-2 border-gray-200 rounded-2xl hover:shadow-lg transition-all duration-300 text-center"
            >
              <div className="text-5xl mb-4">{role.icon}</div>
              <h3 className="text-2xl font-bold mb-3">{role.title}</h3>
              <p className="text-gray-600 mb-6">{role.description}</p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700">
                Join as {role.title}
              </button>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;