import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LaboratoryDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingResults: 0,
    totalTests: 0,
    recentEarnings: 0,
    labName: '',
    isVerified: false
  });
  const [loading, setLoading] = useState(true);
  const [todayAppointments, setTodayAppointments] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get('http://localhost:8085/api/v1/lab/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:8085/api/v1/lab/appointments?date=' + new Date().toISOString().split('T')[0], {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (appointmentsRes.data.success) {
        setTodayAppointments(appointmentsRes.data.data.slice(0, 4));
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const statsData = [
    { 
      label: "Today's Appointments", 
      value: stats.todayAppointments, 
      icon: "📅", 
      color: "from-blue-500 to-teal-500",
      link: "/laboratory/appointments"
    },
    { 
      label: "Pending Results", 
      value: stats.pendingResults, 
      icon: "⏳", 
      color: "from-orange-500 to-red-500",
      link: "/laboratory/appointments?status=processing"
    },
    { 
      label: "Total Tests", 
      value: stats.totalTests, 
      icon: "🧪", 
      color: "from-green-500 to-emerald-500",
      link: "/laboratory/tests"
    },
    { 
      label: "Recent Earnings", 
      value: `${stats.recentEarnings}`, 
      icon: "💰", 
      color: "from-purple-500 to-pink-500",
      link: "/laboratory/earnings"
    }
  ];

  const quickActions = [
    { 
      title: "Manage Tests", 
      description: "Add/update test packages", 
      icon: "🧪",
      color: "bg-gradient-to-r from-teal-500 to-blue-500",
      link: "/laboratory/tests"
    },
    { 
      title: "View Appointments", 
      description: "Today's schedule", 
      icon: "📅",
      color: "bg-gradient-to-r from-blue-500 to-purple-500",
      link: "/laboratory/appointments"
    },
    { 
      title: "Upload Reports", 
      description: "Process test results", 
      icon: "📋",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      link: "/laboratory/reports"
    },
    { 
      title: "View Earnings", 
      description: "Revenue analytics", 
      icon: "💰",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      link: "/laboratory/earnings"
    }
  ];

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8085/api/v1/lab/appointments/${appointmentId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Status updated');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome, {stats.labName}!</h1>
            <p className="text-teal-100 text-lg">
              {stats.isVerified ? '✅ Verified Laboratory' : '⏳ Verification Pending'}
            </p>
          </div>
          {/* <div className="text-right">
            <div className="text-2xl font-bold">4.9⭐</div>
            <div className="text-teal-100">Customer Rating</div>
          </div> */}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-2xl text-white`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Appointments</h2>
            <Link to="/laboratory/appointments" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-xl">
                        {appointment.collectionType === 'home' ? '🚗' : '🏥'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{appointment.patientName}</h3>
                      <p className="text-gray-600 text-sm">{appointment.testName}</p>
                      <p className="text-gray-500 text-xs">
                        {new Date(appointment.collectionDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      appointment.status === 'sample_collected' ? 'bg-green-100 text-green-800' :
                      appointment.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                    <select
                      onChange={(e) => updateAppointmentStatus(appointment._id, e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Update</option>
                      <option value="sample_collected">Sample Collected</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No appointments today</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className={`${action.color} text-white p-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 text-center`}
            >
              <div className="text-2xl mb-2">{action.icon}</div>
              <h3 className="font-bold text-sm mb-1">{action.title}</h3>
              <p className="text-white text-opacity-90 text-xs">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LaboratoryDashboard;