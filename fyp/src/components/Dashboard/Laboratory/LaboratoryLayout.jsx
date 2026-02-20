import React, { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

const LaboratoryLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/laboratory/dashboard', icon: '📊', label: 'Dashboard' },
    { path: '/laboratory/tests', icon: '🧪', label: 'Tests' },
    { path: '/laboratory/appointments', icon: '📅', label: 'Appointments' },
    { path: '/laboratory/reports', icon: '📋', label: 'Reports' },
    { path: '/laboratory/earnings', icon: '💰', label: 'Earnings' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className={`bg-white w-64 min-h-screen border-r fixed lg:static transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform z-30`}>
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
            <div>
              <span className="text-xl font-bold">MediCare</span>
              <div className="text-sm text-gray-500">Laboratory</div>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg ${location.pathname === item.path ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 p-3 w-full text-red-600 hover:bg-red-50 rounded-lg"
          >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2"
          >
            <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-700 mb-1.5"></div>
            <div className="w-6 h-0.5 bg-gray-700"></div>
          </button>
          
          <h1 className="text-xl font-bold">
            {menuItems.find(item => item.path === location.pathname)?.label || 'Dashboard'}
          </h1>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden md:block">
              <div className="font-medium">BioLab Diagnostics</div>
              <div className="text-sm text-gray-500">LAB78901</div>
            </div>
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">BL</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default LaboratoryLayout;