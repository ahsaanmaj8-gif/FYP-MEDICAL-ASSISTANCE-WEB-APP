import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Backend_Url } from './../../../../utils/utils';

const AdminDashboard = () => {
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
  const [recentRegistrations, setRecentRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = `${Backend_Url}/admin`;

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentRegistrations();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_BASE_URL}/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'doctor': return 'text-blue-600 bg-blue-100';
      case 'pharmacy': return 'text-purple-600 bg-purple-100';
      case 'laboratory': return 'text-teal-600 bg-teal-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const dashboardStats = [
    { 
      label: "Total Users", 
      value: stats.users, 
      icon: "👥", 
      color: "from-blue-500 to-cyan-500",
      description: "Registered patients",
    },
    { 
      label: "Verified Doctors", 
      value: stats.doctors, 
      icon: "👨‍⚕️", 
      color: "from-green-500 to-emerald-500",
      description: "Active doctors",
      link: "/admin/doctors?status=verified"
    },
    { 
      label: "Verified Pharmacies", 
      value: stats.pharmacies, 
      icon: "💊", 
      color: "from-purple-500 to-pink-500",
      description: "Active pharmacies",
      link: "/admin/pharmacies?status=verified"
    },
    { 
      label: "Verified Laboratories", 
      value: stats.laboratories, 
      icon: "🔬", 
      color: "from-teal-500 to-blue-500",
      description: "Active laboratories",
      link: "/admin/laboratories?status=verified"
    }
  ];

  const pendingStats = [
    { 
      label: "Doctors", 
      value: stats.pending.doctors, 
      icon: "👨‍⚕️", 
      color: "from-orange-500 to-red-500",
      link: "/admin/doctors?status=pending"
    },
    { 
      label: "Pharmacies", 
      value: stats.pending.pharmacies, 
      icon: "💊", 
      color: "from-orange-500 to-red-500", 
      link: "/admin/pharmacies?status=pending"
    },
    { 
      label: "Laboratories", 
      value: stats.pending.laboratories, 
      icon: "🔬", 
      color: "from-orange-500 to-red-500",
      link: "/admin/laboratories?status=pending"
    }
  ];

  const quickActions = [
    { 
      title: "Verify Doctors", 
      description: "Review doctor applications", 
      icon: "👨‍⚕️",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      link: "/admin/doctors"
    },
    { 
      title: "Verify Pharmacies", 
      description: "Review pharmacy applications", 
      icon: "💊",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      link: "/admin/pharmacies"
    },
    { 
      title: "Verify Laboratories", 
      description: "Review laboratory applications", 
      icon: "🔬",
      color: "bg-gradient-to-r from-teal-500 to-blue-500",
      link: "/admin/laboratories"
    }
  ];

  // ✅ CORRECT: Calculate total pending from individual counts
  const totalPending = (stats.pending?.doctors || 0) + 
                      (stats.pending?.pharmacies || 0) + 
                      (stats.pending?.laboratories || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-gray-800 via-blue-800 to-purple-800 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard 🛡️</h1>
            <p className="text-blue-100 text-xl opacity-90">
              {totalPending > 0 
                ? `${totalPending} pending verifications need attention` 
                : 'All verifications are completed'
              }
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.users}</div>
            <div className="text-blue-100">Total Users</div>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <Link
            key={index}
            to={stat.link || "#"}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105 block"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.description}</p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions & Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className={`${action.color} text-white p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                      {action.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                    <p className="text-white text-opacity-90 text-sm">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Recent Registrations</h2>
              <span className="text-gray-500 text-sm">
                {recentRegistrations.length} new applications
              </span>
            </div>
            
            <div className="space-y-4">
              {recentRegistrations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🎉</div>
                  <p>No pending registrations</p>
                  <p className="text-sm">All applications have been processed</p>
                </div>
              ) : (
                recentRegistrations.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition-colors group border">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow text-xl">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                            {item.type}
                          </span>
                          <span className="text-gray-600 text-sm">{item.specialization}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-gray-600 text-sm">{formatDate(item.date)}</p>
                      <span className="text-yellow-600 text-sm font-medium">Pending</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Pending Verifications Sidebar */}
        <div className="space-y-6">
          {/* Pending Verifications */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
            <h2 className="text-xl font-bold mb-4">⏳ Pending Verifications</h2>
            <div className="space-y-4">
              {pendingStats.map((stat, index) => (
                <Link
                  key={index}
                  to={stat.link}
                  className="block bg-white bg-opacity-20 rounded-xl p-4 hover:bg-opacity-30 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{stat.icon}</span>
                      <div>
                        <div className="text-black font-medium">{stat.label}</div>
                        <div className="text-orange-500 text-sm">{stat.value} waiting</div>
                      </div>
                    </div>
                    {stat.value > 0 && (
                      <div className="bg-white text-orange-600 px-3 py-1 rounded-full text-sm font-bold">
                        {stat.value}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* System Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 System Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Providers:</span>
                <span className="font-bold">{stats.totalProviders}</span>
              </div>
              
              {/* ✅ FIXED: Correct pending calculation */}
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Verifications:</span>
                <span className="font-bold text-orange-600">
                  {totalPending}
                </span>
              </div>
              
              {/* ✅ Keep this commented for now since backend doesn't provide rejected counts */}
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Rejected Applications:</span>
                <span className="font-bold text-red-600">
                  {stats.rejected?.total || 0}
                </span>
              </div> */}
              
              <div className="flex justify-between">
                <span className="text-gray-600">Verified Providers:</span>
                <span className="font-bold text-green-600">{stats.verifiedProviders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;