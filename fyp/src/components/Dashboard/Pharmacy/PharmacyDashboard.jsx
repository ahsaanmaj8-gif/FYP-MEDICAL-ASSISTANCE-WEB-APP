import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PharmacyDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    lowStockMedicines: 0,
    todayRevenue: 0,
    isVerified: false,
    pharmacyName: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/pharmacy/dashboard-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <h1 className="text-4xl font-bold mb-2">
          Welcome, {stats.pharmacyName} 💊
        </h1>
        <p className="text-purple-100 text-xl">
          {stats.pendingOrders} orders need your attention today!
        </p>
        {!stats.isVerified && (
          <div className="mt-4 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg inline-block">
            ⚠️ Your pharmacy is pending verification
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-2xl">
              📦
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Orders</p>
              <p className="text-3xl font-bold text-gray-900">{stats.pendingOrders}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-2xl">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Low Stock</p>
              <p className="text-3xl font-bold text-gray-900">{stats.lowStockMedicines}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl">
              ⚠️
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${stats.todayRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/pharmacy/inventory" className="bg-white p-6 rounded-2xl shadow-lg border text-center hover:shadow-xl transition-shadow">
          <div className="text-3xl mb-2">📦</div>
          <h3 className="font-bold mb-1">Manage Inventory</h3>
          <p className="text-sm text-gray-600">Add/update medicines</p>
        </Link>

        <Link to="/pharmacy/orders" className="bg-white p-6 rounded-2xl shadow-lg border text-center hover:shadow-xl transition-shadow">
          <div className="text-3xl mb-2">🛒</div>
          <h3 className="font-bold mb-1">Process Orders</h3>
          <p className="text-sm text-gray-600">Handle customer orders</p>
        </Link>

        <Link to="/pharmacy/delivery" className="bg-white p-6 rounded-2xl shadow-lg border text-center hover:shadow-xl transition-shadow">
          <div className="text-3xl mb-2">🚚</div>
          <h3 className="font-bold mb-1">Delivery</h3>
          <p className="text-sm text-gray-600">Track deliveries</p>
        </Link>

        <Link to="/pharmacy/profile" className="bg-white p-6 rounded-2xl shadow-lg border text-center hover:shadow-xl transition-shadow">
          <div className="text-3xl mb-2">👤</div>
          <h3 className="font-bold mb-1">Profile</h3>
          <p className="text-sm text-gray-600">Update pharmacy info</p>
        </Link>
      </div>
    </div>
  );
};

export default PharmacyDashboard;