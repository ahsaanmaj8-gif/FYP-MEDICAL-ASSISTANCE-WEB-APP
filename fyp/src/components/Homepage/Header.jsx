import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ThemeContext } from './../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './../ThemeToggle';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    
    const userType = user.userType || user.role;
    
    switch(userType.toLowerCase()) {
      case 'patient':
      case 'user':
        return '/patient/dashboard';
      case 'doctor':
        return '/doctor/dashboard';
      case 'pharmacy':
        return '/pharmacy/dashboard';
      case 'laboratory':
        return '/laboratory/dashboard';
      case 'admin':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  };

  const getUserInitial = () => {
    if (!user) return 'U';
    if (user.name && user.name.length > 0) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email && user.email.length > 0) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (!user) return 'Guest';
    if (user.name) return user.name;
    if (user.email) {
      // Extract username from email (before @)
      const username = user.email.split('@')[0];
      return username.charAt(0).toUpperCase() + username.slice(1);
    }
    return 'User';
  };

  const getUserRole = () => {
    if (!user) return '';
    const role = user.userType || user.role || 'user';
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const isLoggedIn = isAuthenticated() && user;

  // Debug log
  useEffect(() => {
    console.log('Header - User:', user);
    console.log('Header - Is Authenticated:', isAuthenticated());
    console.log('Header - Token exists:', !!localStorage.getItem('token'));
  }, [user]);

  return (
    <header className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-sm sticky top-0 z-50`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              MediCare
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Home
            </Link>
            <Link to="/doctors" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Doctors
            </Link>
            <Link to="/specialties" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Specialties
            </Link>
            <Link to="/video-consult" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Video Consult
            </Link>
            <Link to="/pharmacy" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Pharmacy
            </Link>
            <Link to="/lab-tests" className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}>
              Lab Tests
            </Link>
          </nav>

          <ThemeToggle />

          {/* User Info / Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                    {getUserDisplayName()}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {getUserRole()}
                  </div>
                </div>
                
                {/* User Dropdown */}
                <div className="relative group">
                  <button className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}>
                    <span className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>
                      {getUserInitial()}
                    </span>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ${
                    theme === 'dark' ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                  }`}>
                    <Link 
                      to={getDashboardLink()}
                      className={`block px-4 py-2 ${theme === 'dark' ? 'text-gray-300 hover:bg-gray-600' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      📊 Dashboard
                    </Link>
                    
                    <div className="border-t my-1 border-gray-600"></div>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left px-4 py-2 ${theme === 'dark' ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'}`}
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Login
                </Link>
                <Link
                  to="/role-selection"
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className={`w-6 h-0.5 mb-1.5 transition-transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''} ${
              theme === 'dark' ? 'bg-gray-300' : 'bg-gray-700'
            }`}></div>
            <div className={`w-6 h-0.5 mb-1.5 ${isMenuOpen ? 'opacity-0' : ''} ${
              theme === 'dark' ? 'bg-gray-300' : 'bg-gray-700'
            }`}></div>
            <div className={`w-6 h-0.5 transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''} ${
              theme === 'dark' ? 'bg-gray-300' : 'bg-gray-700'
            }`}></div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <nav className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🏠 Home
              </Link>
              <Link 
                to="/doctors" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                👨‍⚕️ Doctors
              </Link>
              <Link 
                to="/specialties" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🏥 Specialties
              </Link>
              <Link 
                to="/video-consult" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                📹 Video Consult
              </Link>
              <Link 
                to="/pharmacy" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                💊 Pharmacy
              </Link>
              <Link 
                to="/lab-tests" 
                className={`py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                🔬 Lab Tests
              </Link>
              
              <div className="pt-4 border-t border-gray-600">
                {isLoggedIn ? (
                  <>
                    <div className={`py-2 font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                      👋 Hello, {getUserDisplayName()}
                    </div>
                    <Link 
                      to={getDashboardLink()}
                      className={`block py-2 ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-blue-600'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      📊 Go to Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className={`block w-full text-left py-2 mt-2 ${theme === 'dark' ? 'text-red-400' : 'text-red-600'}`}
                    >
                      🚪 Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-3 pt-2">
                    <Link 
                      to="/login" 
                      className={`py-2 text-center rounded-lg ${theme === 'dark' ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      🔑 Login
                    </Link>
                    <Link 
                      to="/role-selection" 
                      className="py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      ✨ Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;