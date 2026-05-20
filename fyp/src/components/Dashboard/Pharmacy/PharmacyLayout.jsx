import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Backend_Url } from './../../../../utils/utils';

const PharmacyLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [pharmacyName, setPharmacyName] = useState('Pharmacy');
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/pharmacy/dashboard', icon: '📊', label: 'Dashboard', color: 'purple' },
    { path: '/pharmacy/inventory', icon: '📦', label: 'Inventory', color: 'blue' },
    { path: '/pharmacy/orders', icon: '🛒', label: 'Orders', color: 'green' },
    { path: '/pharmacy/delivery', icon: '🚚', label: 'Delivery', color: 'red' },
    { path: '/pharmacy/earnings', icon: '💰', label: 'Earnings', color: 'yellow' },
    { path: '/pharmacy/profile', icon: '👤', label: 'Profile', color: 'gray' }
  ];

  useEffect(() => {
    fetchPharmacyStats();
  }, []);

  const fetchPharmacyStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch pending orders count
      const ordersResponse = await axios.get(`${Backend_Url}/pharmacy/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (ordersResponse.data.success) {
        const pending = ordersResponse.data.data.filter(order => order.status === 'pending').length;
        setPendingOrders(pending);
      }

      // Fetch pharmacy name
      const profileResponse = await axios.get(`${Backend_Url}/pharmacy/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (profileResponse.data.success) {
        setPharmacyName(profileResponse.data.data.pharmacyName || 'Pharmacy');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const getColorClasses = (color, isActive = false) => {
    const colors = {
      purple: isActive ? 'bg-purple-500 text-white' : 'text-purple-600 hover:bg-purple-50',
      blue: isActive ? 'bg-blue-500 text-white' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-500 text-white' : 'text-green-600 hover:bg-green-50',
      red: isActive ? 'bg-red-500 text-white' : 'text-red-600 hover:bg-red-50',
      yellow: isActive ? 'bg-yellow-500 text-white' : 'text-yellow-600 hover:bg-yellow-50',
      gray: isActive ? 'bg-gray-500 text-white' : 'text-gray-600 hover:bg-gray-50'
    };
    return colors[color] || colors.purple;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex">
      {/* Sidebar */}
      <div className={`bg-white w-80 min-h-screen shadow-2xl fixed lg:static transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 z-30 border-r border-gray-200`}>
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-purple-600 to-pink-700">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-purple-600 font-bold text-xl">M</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">MediCare</span>
              <div className="text-purple-100 text-sm mt-1">Pharmacy Portal</div>
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
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 text-white text-center mb-4">
            <div className="text-2xl font-bold">{pendingOrders}</div>
            <div className="text-green-100 text-sm">Pending Orders</div>
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
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {menuItems.find(item => item.path === location.pathname)?.label || 'Pharmacy Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <button className="relative p-3 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-200">
                <span className="text-2xl">🔔</span>
                {pendingOrders > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* User Profile */}
              <div className="flex items-center space-x-4 bg-white rounded-2xl p-3 shadow-lg">
                <div className="text-right">
                  <div className="font-bold text-gray-800">{pharmacyName}</div>
                  <div className="text-sm text-gray-500">Pharmacy Owner</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {pharmacyName.charAt(0)}
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

export default PharmacyLayout;