import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

const RoleSelection = () => {
  const { theme } = useContext(ThemeContext);

  const roles = [
    {
      id: 'patient',
      title: 'Patient',
      icon: '👤',
      description: 'Book appointments, consult doctors, manage health records',
      color: 'blue',
      bgClass: 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40',
      borderClass: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      btnClass: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      id: 'doctor',
      title: 'Doctor',
      icon: '👨‍⚕️',
      description: 'Join as healthcare provider, manage patients, provide consultations',
      color: 'green',
      bgClass: 'bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40',
      borderClass: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-100 dark:bg-green-800',
      btnClass: 'bg-green-600 hover:bg-green-700'
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      icon: '💊',
      description: 'Register your pharmacy, sell medicines, manage inventory',
      color: 'purple',
      bgClass: 'bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/40',
      borderClass: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
      btnClass: 'bg-purple-600 hover:bg-purple-700'
    },
    {
      id: 'laboratory',
      title: 'Laboratory',
      icon: '🔬',
      description: 'Register your lab, offer tests, manage sample collections',
      color: 'orange',
      bgClass: 'bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40',
      borderClass: 'border-orange-200 dark:border-orange-800',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      btnClass: 'bg-orange-600 hover:bg-orange-700'
    }
  ];

  // Dynamic classes based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-400' : 'text-gray-600';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const cardBorder = theme === 'dark' ? 'border-gray-700' : 'border-gray-200';

return (
  <div className={`min-h-screen flex flex-col justify-center py-12 px-4 transition-colors duration-300
    ${theme === 'dark' ? 'bg-gray-950' : 'bg-gray-50'}`}>

    <div className="max-w-5xl mx-auto w-full">

      {/* Logo */}
      <Link to="/" className="flex items-center justify-center gap-3 mb-10">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
          <span className="text-white font-bold text-xl">M</span>
        </div>
        <span className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          MediCare
        </span>
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <h2 className={`text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Join MediCare
        </h2>
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-lg`}>
          Choose your role to get started
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {roles.map((role) => (
          <Link
            key={role.id}
            to={`/signup/${role.id}`}
            className={`group rounded-2xl border p-6 transition-all duration-300
              ${theme === 'dark'
                ? 'bg-gray-900 border-gray-800 hover:border-gray-700'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-lg'
              }
              hover:-translate-y-1`}
          >

            {/* Top row */}
            <div className="flex items-start gap-4">

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl
                ${role.id === 'patient' && 'bg-blue-100 dark:bg-blue-900/30'}
                ${role.id === 'doctor' && 'bg-green-100 dark:bg-green-900/30'}
                ${role.id === 'pharmacy' && 'bg-purple-100 dark:bg-purple-900/30'}
                ${role.id === 'laboratory' && 'bg-orange-100 dark:bg-orange-900/30'}
              `}>
                {role.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className={`text-xl font-semibold mb-1
                  ${theme === 'dark' ? 'text-white' : 'text-gray-900'}
                  group-hover:text-blue-600 transition`}>
                  {role.title}
                </h3>

                <p className={`text-sm leading-relaxed
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {role.description}
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 flex items-center justify-between">

              <span className={`text-xs
                ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                {role.id === 'patient' && 'Free registration'}
                {role.id === 'doctor' && 'Verified doctors'}
                {role.id === 'pharmacy' && 'Sell medicines'}
                {role.id === 'laboratory' && 'Digital reports'}
              </span>

              <span className="text-sm font-medium text-blue-600 group-hover:underline">
                Join →
              </span>

            </div>

          </Link>
        ))}

      </div>

      {/* Login */}
      <div className="text-center mt-10">
        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>

    </div>
  </div>
);
};

export default RoleSelection;