import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    pendingLabResults: 0,
    totalOrders: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile for name
      const profileRes = await axios.get(`${Backend_Url}/patient/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (profileRes.data.success) {
        setUserName(profileRes.data.data.name || 'Patient');
      }

      // Fetch dashboard stats
      const statsRes = await axios.get(`${Backend_Url}/patient/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }

      // Fetch recent activity
      const activityRes = await axios.get(`${Backend_Url}/patient/recent-activity`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (activityRes.data.success) {
        setRecentActivity(activityRes.data.data);
      }

    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      title: 'Book Appointment', 
      description: 'Schedule with specialist', 
      icon: '📅',
      color: 'from-blue-500 to-cyan-500',
      link: '/doctors'
    },
    { 
      title: 'Video Consult', 
      description: 'Instant doctor consultation', 
      icon: '🎥',
      color: 'from-green-500 to-emerald-500',
      link: '/video-consult'
    },
    { 
      title: 'Order Medicines', 
      description: 'Get prescriptions delivered', 
      icon: '💊',
      color: 'from-purple-500 to-pink-500',
      link: '/pharmacy'
    },
    { 
      title: 'Book Lab Test', 
      description: 'Health checkups & tests', 
      icon: '🔬',
      color: 'from-orange-500 to-red-500',
      link: '/lab-tests'
    }
  ];

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivered': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {userName}! 👋
            </h1>
            <p className="text-blue-100 text-xl opacity-90">
              You have {stats.upcomingAppointments} upcoming appointment{stats.upcomingAppointments !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Upcoming Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.upcomingAppointments}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              📅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Prescriptions</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.activePrescriptions}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              💊
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Lab Results</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingLabResults}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              🔬
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Medicine Orders</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              🛒
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.link}
            className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all group`}
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{action.icon}</div>
            <h3 className="font-bold text-lg mb-2">{action.title}</h3>
            <p className="text-white text-opacity-90 text-sm">{action.description}</p>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
          <Link to="/patient/appointments" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </Link>
        </div>
        
        {recentActivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-blue-50 transition">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow">
                  <span className="text-2xl">{activity.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                  <p className="text-gray-600 text-sm">{formatTimeAgo(activity.time)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

     
    </div>
  );
};

export default PatientDashboard;