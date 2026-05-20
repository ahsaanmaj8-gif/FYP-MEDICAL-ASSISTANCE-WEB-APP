import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const DoctorLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [doctorData, setDoctorData] = useState({
    name: 'Doctor',
    specialization: '',
    rating: 0,
    totalPatients: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch doctor profile
      const profileRes = await axios.get(`${Backend_Url}/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (profileRes.data.success) {
        const doctor = profileRes.data.data;
        setDoctorData({
          name: doctor.user?.name || 'Doctor',
          specialization: doctor.specialization || '',
          rating: doctor.rating?.average || 0,
          totalPatients: doctor.totalPatients || 0
        });
      }

      // Fetch total patients count
      const patientsRes = await axios.get(`${Backend_Url}/doctor/patients`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (patientsRes.data.success) {
        setDoctorData(prev => ({
          ...prev,
          totalPatients: patientsRes.data.data.length
        }));
      }

    } catch (error) {
      console.error('Error fetching doctor data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { path: '/doctor/dashboard', icon: '📊', label: 'Dashboard', color: 'blue' },
    { path: '/doctor/appointments', icon: '📅', label: 'Appointments', color: 'green' },
    { path: '/doctor/patients', icon: '👥', label: 'Patients', color: 'purple' },
    { path: '/doctor/prescriptions', icon: '💊', label: 'Prescriptions', color: 'orange' },
    { path: '/doctor/schedule', icon: '⏰', label: 'Schedule', color: 'teal' },
    { path: '/doctor/earnings', icon: '💰', label: 'Earnings', color: 'yellow' },
    { path: '/doctor/profile', icon: '👤', label: 'Profile', color: 'gray' }
  ];

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      blue: isActive ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50',
      orange: isActive ? 'bg-orange-500 text-white' : 'text-orange-600 hover:bg-orange-50',
      teal: isActive ? 'bg-teal-500 text-white' : 'text-teal-600 hover:bg-teal-50',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      gray: isActive ? 'bg-gray-500 text-white' : 'text-gray-600 hover:bg-gray-50'
    };
    return colors[color] || colors.blue;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Get page title from current route
  const getPageTitle = () => {
    const currentItem = menuItems.find(item => item.path === location.pathname);
    return currentItem?.label || 'Dashboard';
  };

  // Get doctor initials
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 flex">
      {/* Sidebar */}
      <div className={`bg-white w-80 min-h-screen shadow-2xl fixed lg:static transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30 border-r border-gray-200`}>
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-green-600 to-emerald-700">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-green-600 font-bold text-xl">M</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MediCare</span>
              <div className="text-green-100 text-sm mt-1">Doctor Portal</div>
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
                className={`flex items-center px-4 py-4 rounded-2xl transition-all duration-200 font-medium group ${
                  getColorClasses(item.color, isActive)
                } ${isActive ? 'shadow-lg scale-105' : 'hover:scale-105'}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="text-2xl mr-4 transition-transform group-hover:scale-110">{item.icon}</span>
                <span className="text-lg">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-6 border-t border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-4 text-white text-center mb-4">
            <div className="text-2xl font-bold">{doctorData.totalPatients}</div>
            <div className="text-blue-100 text-sm">Total Patients</div>
          </div>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-200 font-medium group"
          >
            <span className="text-2xl mr-4">🚪</span>
            <span className="text-lg">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-0 min-h-screen">
        {/* Top Bar */}
        <header className="bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200 sticky top-0 z-20">
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-600 mb-1.5"></div>
                <div className="w-6 h-0.5 bg-gray-600"></div>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {getPageTitle()}
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              {/* <button className="relative p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-200 group">
                <span className="text-2xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
              </button> */}

              {/* User Profile */}
              <div className="flex items-center space-x-4 bg-white rounded-2xl p-3 shadow-lg">
                <div className="text-right">
                  <div className="font-bold text-gray-800">{doctorData.name}</div>
                  <div className="text-sm text-gray-500">
                    {doctorData.specialization || 'Doctor'} • {doctorData.rating || 0}⭐
                  </div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {getInitials(doctorData.name)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
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

export default DoctorLayout;