import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const DoctorDashboard = () => {
  const [stats, setStats] = useState({
    todayAppointments: 0,
    pendingConsultations: 0,
    totalPatients: 0,
    monthlyEarnings: 0,
    doctorName: '',
    rating: 0
  });
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login again');
        return;
      }

      console.log('Fetching doctor dashboard data...');

      // Fetch doctor profile first to get name
      const profileRes = await axios.get(`${Backend_Url}/doctor/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      let doctorName = 'Doctor';
      let doctorRating = 0;
      
      if (profileRes.data.success) {
        const doctor = profileRes.data.data;
        doctorName = doctor.user?.name || 'Doctor';
        doctorRating = doctor.rating?.average || 0;
      }

      // Fetch dashboard stats
      const statsRes = await axios.get(`${Backend_Url}/doctor/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Dashboard stats response:', statsRes.data);
      
      if (statsRes.data.success) {
        setStats({
          todayAppointments: statsRes.data.data.todayAppointments || 0,
          pendingConsultations: statsRes.data.data.pendingConsultations || 0,
          totalPatients: statsRes.data.data.totalPatients || 0,
          monthlyEarnings: statsRes.data.data.monthlyEarnings || 0,
          doctorName: doctorName,
          rating: doctorRating
        });
      }

      // Fetch today's appointments
      const aptRes = await axios.get(`${Backend_Url}/doctor/appointments?filter=today`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Today appointments response:', aptRes.data);

      if (aptRes.data.success) {
        setTodayAppointments(aptRes.data.data.slice(0, 4));
      }

    } catch (error) {
      console.error('Error fetching dashboard:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('token');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setError('Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { 
      title: "Start Consultation", 
      description: "Begin video call", 
      icon: "🎥",
      color: "from-green-500 to-emerald-500",
      link: "/doctor/appointments"
    },
    { 
      title: "Write Prescription", 
      description: "Digital prescriptions", 
      icon: "💊",
      color: "from-blue-500 to-cyan-500",
      link: "/doctor/prescriptions"
    },
    { 
      title: "Patient Records", 
      description: "View medical history", 
      icon: "📋",
      color: "from-purple-500 to-pink-500",
      link: "/doctor/patients"
    },
    { 
      title: "Set Schedule", 
      description: "Manage availability", 
      icon: "⏰",
      color: "from-orange-500 to-red-500",
      link: "/doctor/schedule"
    }
  ];

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'scheduled': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'scheduled': 'Scheduled',
      'confirmed': 'Confirmed',
      'in-progress': 'In Progress',
      'completed': 'Completed',
      'cancelled': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <div className="text-4xl mb-3">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Dashboard</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section - REAL DOCTOR NAME */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              Welcome, {stats.doctorName}! 👨‍⚕️
            </h1>
            <p className="text-green-100 text-xl opacity-90">
              {stats.todayAppointments} appointment{stats.todayAppointments !== 1 ? 's' : ''} scheduled today
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {stats.rating > 0 ? stats.rating.toFixed(1) : 'New'}⭐
            </div>
            <div className="text-green-100">Patient Rating</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - REAL NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-400 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.todayAppointments}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              📅
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-400 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Consultations</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pendingConsultations}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              ⏳
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-400 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalPatients}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-400 hover:shadow-xl transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Current Monthly Earnings</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">Rs.{stats.monthlyEarnings}</p>
            </div>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-2xl text-white">
              💰
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Today's Appointments - REAL APPOINTMENTS */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-400 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Today's Schedule</h2>
            <Link to="/doctor/appointments" className="text-green-600 hover:text-green-700 text-sm font-medium">
              View All ({stats.todayAppointments})
            </Link>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4 text-gray-400">📅</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Appointments Today</h3>
              <p className="text-gray-500">You have no appointments scheduled for today.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayAppointments.map((apt) => (
                <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-green-50 transition border group">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow group-hover:shadow-md transition">
                      <span className="text-xl">
                        {apt.appointmentType === 'video-consultation' ? '🎥' : '👤'}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{apt.patient?.name || 'Patient'}</h3>
                      <p className="text-gray-600 text-sm flex items-center mt-1">
                        <span className="mr-1">⏰</span> {formatTime(apt.appointmentTime)}
                      </p>
                      {apt.symptoms?.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1 flex items-center">
                          <span className="mr-1">🩺</span> {apt.symptoms.slice(0, 2).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(apt.status)}`}>
                      {getStatusText(apt.status)}
                    </span>
                    <Link
                      to={`/doctor/appointments`}
                      className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-green-700 transition shadow-md hover:shadow-lg"
                    >
                      Start
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`bg-gradient-to-r ${action.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all group text-center`}
              >
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{action.icon}</div>
                <h3 className="font-bold text-lg mb-1">{action.title}</h3>
                <p className="text-white text-opacity-90 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-400 p-6">
            <h3 className="font-bold text-gray-900 mb-3">Today's Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Completed:</span>
                <span className="font-bold text-green-600">
                  {todayAppointments.filter(apt => apt.status === 'completed').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">In Progress:</span>
                <span className="font-bold text-blue-600">
                  {todayAppointments.filter(apt => apt.status === 'in-progress').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending:</span>
                <span className="font-bold text-yellow-600">
                  {todayAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats - REAL NUMBERS */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-400 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.totalPatients}</div>
            <div className="text-gray-600 text-sm mt-1">Total Patients</div>
            <div className="text-xs text-gray-400 mt-1">Lifetime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{stats.todayAppointments}</div>
            <div className="text-gray-600 text-sm mt-1">Today's Appointments</div>
            <div className="text-xs text-gray-400 mt-1">{new Date().toLocaleDateString()}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.pendingConsultations}</div>
            <div className="text-gray-600 text-sm mt-1">Pending</div>
            <div className="text-xs text-gray-400 mt-1">Need attention</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">{stats.monthlyEarnings}</div>
            <div className="text-gray-600 text-sm mt-1">This Month</div>
            <div className="text-xs text-gray-400 mt-1">
              {new Date().toLocaleDateString('default', { month: 'long' })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;