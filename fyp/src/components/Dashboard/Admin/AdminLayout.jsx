import React, { useState, useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
// import { ThemeContext } from '../../context/ThemeContext';
// import ThemeToggle from '../../components/ThemeToggle';
import { ThemeContext } from '../../../context/ThemeContext';
import ThemeToggle from '../../ThemeToggle';
import axios from 'axios';
import { Backend_Url } from './../../../../utils/utils';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  const menuItems = [
    { path: '/admin/dashboard', icon: '📊', label: 'Dashboard', color: 'blue' },
    { path: '/admin/doctors', icon: '👨‍⚕️', label: 'Doctors', color: 'purple' },
    { path: '/admin/pharmacies', icon: '💊', label: 'Pharmacies', color: 'orange' },
    { path: '/admin/laboratories', icon: '🔬', label: 'Laboratories', color: 'red' }
  ];

  const getColorClasses = (color, isActive = false) => {
    const baseClasses = "flex items-center px-4 py-4 rounded-2xl transition-all duration-200 font-medium group";
    
    if (isActive) {
      const activeColors = {
        blue: 'bg-blue-500 text-white shadow-lg scale-105',
        purple: 'bg-purple-500 text-white shadow-lg scale-105',
        orange: 'bg-orange-500 text-white shadow-lg scale-105',
        red: 'bg-red-500 text-white shadow-lg scale-105'
      };
      return `${baseClasses} ${activeColors[color] || activeColors.blue}`;
    }

    const inactiveColors = {
      blue: 'text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:scale-105 dark:text-blue-400',
      purple: 'text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:scale-105 dark:text-purple-400',
      orange: 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:scale-105 dark:text-orange-400',
      red: 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 hover:scale-105 dark:text-red-400'
    };
    
    return `${baseClasses} ${inactiveColors[color] || inactiveColors.blue}`;
  };






    const [loading, setLoading] = useState(true);
  






  const getAuthToken = () => localStorage.getItem('token');


    const [recentRegistrations, setRecentRegistrations] = useState([]);
  

  const API_BASE_URL = `${Backend_Url}/admin`;


   const [stats, setStats] = useState({
      users: 0,
      doctors: 0,
      pharmacies: 0,
      laboratories: 0,
      totalProviders: 0,
      verifiedProviders: 0,
      pending: {
        doctors: 0,
        pharmacies: 0,
        laboratories: 0
      }
    });

    const fetchDashboardStats = async () => {
  try {
    setLoading(true); // ✅ Start loading
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (response.data.success) {
      setStats(response.data.data);
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  } finally {
    setLoading(false); // ✅ Stop loading
  }
};
    


      const fetchRecentRegistrations = async () => {
  try {
    const token = getAuthToken();
    const recentData = [];
    
    // Fetch doctors
    const doctorsRes = await axios.get(`${API_BASE_URL}/doctors?status=pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (doctorsRes.data.success) {
      doctorsRes.data.data.slice(0, 3).forEach(doctor => {
        recentData.push({
          id: doctor.id,
          name: doctor.name,
          type: 'doctor',
          specialization: doctor.specialization,
          date: doctor.appliedDate,
          icon: '👨‍⚕️'
        });
      });
    }

    // Fetch pharmacies
    const pharmaciesRes = await axios.get(`${API_BASE_URL}/pharmacies?status=pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (pharmaciesRes.data.success) {
      pharmaciesRes.data.data.slice(0, 2).forEach(pharmacy => {
        recentData.push({
          id: pharmacy.id,
          name: pharmacy.name,
          type: 'pharmacy',
          specialization: 'Pharmacy',
          date: pharmacy.appliedDate,
          icon: '💊'
        });
      });
    }

    // Fetch laboratories
    const labsRes = await axios.get(`${API_BASE_URL}/laboratories?status=pending`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (labsRes.data.success) {
      labsRes.data.data.slice(0, 2).forEach(lab => {
        recentData.push({
          id: lab.id,
          name: lab.name,
          type: 'laboratory',
          specialization: 'Laboratory',
          date: lab.appliedDate,
          icon: '🔬'
        });
      });
    }

    // Sort by date and take latest 5
    recentData.sort((a, b) => new Date(b.date) - new Date(a.date));
    setRecentRegistrations(recentData.slice(0, 5));

  } catch (error) {
    console.error('Error fetching recent registrations:', error);
  } finally {
    setLoading(false);
  }
};



    useEffect(() => {
        fetchDashboardStats();
        fetchRecentRegistrations();
      }, []);



const pendingStats = [
  { 
    label: "Doctors", 
    value: stats.pending.doctors, 
    icon: "👨‍⚕️", 
    colorDark: "bg-amber-400 text-amber-900",
    colorLight: "bg-amber-500 text-white",
    link: "/admin/doctors?status=pending"
  },
  { 
    label: "Pharmacies", 
    value: stats.pending.pharmacies, 
    icon: "💊", 
    colorDark: "bg-amber-400 text-amber-900",
    colorLight: "bg-amber-500 text-white",
    link: "/admin/pharmacies?status=pending"
  },
  { 
    label: "Laboratories", 
    value: stats.pending.laboratories, 
    icon: "🔬", 
    colorDark: "bg-amber-400 text-amber-900",
    colorLight: "bg-amber-500 text-white",
    link: "/admin/laboratories?status=pending"
  }
];



  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`w-80 min-h-screen fixed lg:static transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 z-30 border-r ${
        theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } shadow-2xl`}>
        
        {/* Header */}
        <div className={`p-8 border-b ${
          theme === 'dark' ? 'bg-gradient-to-r from-gray-900 to-blue-900 border-gray-700' : 'bg-gradient-to-r from-gray-800 to-blue-900 border-gray-100'
        }`}>
          <Link to="/admin/dashboard" className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-white'
            }`}>
              <span className={`font-bold text-xl ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`}>M</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MediCare</span>
              <div className="text-blue-100 text-sm mt-1">Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={getColorClasses(item.color, isActive)}
              >
                <span className="text-2xl mr-4 transition-transform group-hover:scale-110">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
                {isActive && (
                  <div className={`ml-auto w-2 h-2 rounded-full ${
                    theme === 'dark' ? 'bg-gray-200' : 'bg-white'
                  }`}></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Quick Stats */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          
          {/* Theme Toggle */}
          <div className="flex justify-center">
            <ThemeToggle />
          </div>

          {/* Quick Stats */}
          <div className={`rounded-2xl p-4 ${
            theme === 'dark' ? 'bg-blue-900/50 text-white' : 'bg-blue-50 text-blue-900'
          }`}>




            <div className="text-sm font-medium mb-2">Quick Access</div>
            {/* <div className="space-y-2">

              <Link 
                to="/admin/doctors?status=pending" 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-blue-800' : 'hover:bg-blue-100'
                }`}
              >
                <span className="text-sm">Pending Doctors</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  theme === 'dark' ? 'bg-blue-400 text-blue-900' : 'bg-blue-500 text-white'
                }`}>0</span>
              </Link>
              <Link 
                to="/admin/pharmacies?status=pending" 
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  theme === 'dark' ? 'hover:bg-blue-800' : 'hover:bg-blue-100'
                }`}
              >
                <span className="text-sm">Pending Pharmacies</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                  theme === 'dark' ? 'bg-purple-400 text-purple-900' : 'bg-purple-500 text-white'
                }`}>0</span>
              </Link>
            </div> */}



   {/* <div className="space-y-2">
  {pendingStats.map((stat, index) => (
    <Link
      key={index}
      to={stat.link}
      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
        theme === "dark" ? "hover:bg-blue-800" : "hover:bg-blue-100"
      }`}
    >
      <span className="text-sm">{stat.label}</span>

      <span
  className={`px-2 py-1 rounded-full text-xs font-bold ${
    theme === "dark" ? stat.colorDark : stat.colorLight
  }`}
>
  {stat.value}
</span>
    </Link>
  ))}
</div> */}



{/* // Add loading indicator */}
<div className="space-y-2">
  {pendingStats.map((stat, index) => (
    <Link
      key={index}
      to={stat.link}
      className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
        theme === "dark" ? "hover:bg-blue-800" : "hover:bg-blue-100"
      }`}
    >
      <span className="text-sm">{stat.label}</span>
      
      {/* Show loading or value */}
      {loading ? (
        <div className="w-6 h-6 rounded-full border-2 border-gray-300 border-t-blue-500 animate-spin"></div>
      ) : (
        <span
          className={`px-2 py-1 rounded-full text-xs font-bold ${
            theme === "dark" ? stat.colorDark : stat.colorLight
          }`}
        >
          {stat.value}
        </span>
      )}
    </Link>
  ))}
</div>







          </div>







        </div>

        {/* Logout Button */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-3 rounded-2xl transition-all duration-200 font-medium group ${
              theme === 'dark' 
                ? 'text-red-400 hover:bg-red-900/30' 
                : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <span className="text-2xl mr-4">🚪</span>
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        {/* Top Bar */}
        <header className={`backdrop-blur-lg shadow-sm border-b sticky top-0 z-20 ${
          theme === 'dark' 
            ? 'bg-gray-800/80 border-gray-700 text-white' 
            : 'bg-white/80 border-gray-200 text-gray-900'
        }`}>
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`lg:hidden p-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-white'
                }`}
              >
                <div className={`w-6 h-0.5 mb-1.5 ${
                  theme === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                }`}></div>
                <div className={`w-6 h-0.5 mb-1.5 ${
                  theme === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                }`}></div>
                <div className={`w-6 h-0.5 ${
                  theme === 'dark' ? 'bg-gray-300' : 'bg-gray-600'
                }`}></div>
              </button>
              <h1 className={`text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent ${
                theme === 'dark' 
                  ? 'from-gray-200 to-blue-200' 
                  : 'from-gray-800 to-blue-800'
              }`}>
                {menuItems.find(item => item.path === location.pathname)?.label || 'Admin Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Admin Info */}
              <div className={`flex items-center space-x-3 rounded-2xl p-3 shadow-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-white'
              }`}>
                <div className="text-right">
                  <div className="font-bold">Admin User</div>
                  <div className={`text-sm ${
                    theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                  }`}>Administrator</div>
                </div>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-gray-600 to-blue-600' 
                    : 'bg-gradient-to-r from-gray-700 to-blue-700'
                }`}>
                  <span className="text-white font-bold text-sm">AD</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminLayout;