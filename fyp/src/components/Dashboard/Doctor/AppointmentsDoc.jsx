import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AppointmentsDoc = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, [activeTab]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8085/api/v1/doctor/appointments?filter=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        console.log(response.data);
        
        setAppointments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `http://localhost:8085/api/v1/doctor/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(`Appointment ${status === 'in-progress' ? 'started' : 'completed'}`);
        fetchAppointments();
      }
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to update status');
    }
  };

  const handleStart = (id) => {
    updateStatus(id, 'in-progress');
  };

  const handleComplete = (id) => {
    updateStatus(id, 'completed');
  };

  const formatTime = (date, time) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString() + ' at ' + time;
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'scheduled': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Scheduled' },
      'confirmed': { bg: 'bg-green-100', text: 'text-green-800', label: 'Confirmed' },
      'in-progress': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'In Progress' },
      'completed': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Completed' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Cancelled' },
      'no-show': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'No Show' }
    };
    return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status };
  };

  // 👇 THIS FUNCTION CONTAINS THE VIDEO CALL BUTTON
  const renderActionButtons = (apt) => {
    switch(apt.status) {
      case 'scheduled':
        return (
          <button
            onClick={() => updateStatus(apt._id, 'confirmed')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Confirm
          </button>
        );

      // case 'confirmed':
      //   return (
      //     <button
      //       onClick={() => {
      //         if (apt.appointmentType === 'video-consultation') {
      //           // 👇 THIS IS THE VIDEO CALL BUTTON - Navigates to video page
      //           navigate(`/doctor/video-call/${apt._id}`);
      //         } else {
      //           handleStart(apt._id);
      //         }
      //       }}
      //       className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      //     >
      //       {apt.appointmentType === 'video-consultation' ? 'Start Video Call' : 'Start'}
      //     </button>
      //   );



      case 'confirmed':
  return (
    <button
      onClick={async () => {
        if (apt.appointmentType === 'video-consultation') {
          try {
            const token = localStorage.getItem('token');
            
            // 1. Update status to in-progress
            await axios.put(
              `http://localhost:8085/api/v1/doctor/appointments/${apt._id}/status`,
              { status: 'in-progress' },
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // 2. Get Jitsi meeting URL
            const response = await axios.get(
              `http://localhost:8085/api/v1/video/appointment/${apt._id}/room`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (response.data.success) {
              // 3. Open in new tab
              window.open(response.data.data.meetingUrl, '_blank');
              
              // 4. Refresh appointments list
              fetchAppointments();
              toast.success('Video consultation started! Share the link with patient.');
            }
          } catch (error) {
            console.error('Error starting video:', error);
            toast.error('Failed to start video consultation');
          }
        } else {
          handleStart(apt._id);
        }
      }}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
    >
      {apt.appointmentType === 'video-consultation' ? 'Start Video Call (meet.jit.si)' : 'Start'}
    </button>
  );



      case 'in-progress':
        return (
          <button
            onClick={() => handleComplete(apt._id)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Complete
          </button>
        );

      case 'completed':
        return (
          <button
            onClick={() => navigate(`/doctor/prescriptions?appointment=${apt._id}`)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
          >
            Write Prescription
          </button>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['today', 'upcoming', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                activeTab === tab
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab} ({appointments.length})
            </button>
          ))}
        </nav>
      </div>

      {/* Appointments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border text-center">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-semibold mb-2">No appointments found</h3>
          <p className="text-gray-600">You have no {activeTab} appointments</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((apt) => {
            const status = getStatusBadge(apt.status);
            return (
              <div key={apt._id} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">👤</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{apt.patient?.name || 'Patient'}</h3>
                      <p className="text-gray-600 text-sm">
                        {formatTime(apt.appointmentDate, apt.appointmentTime)}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">
                        {apt.appointmentType === 'video-consultation' ? '🎥 Video' : '🏥 In-Person'} • 
                        Fee: ${apt.amount}
                      </p>
                      {apt.symptoms?.length > 0 && (
                        <p className="text-gray-500 text-xs mt-1">
                          Symptoms: {apt.symptoms.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 mt-4 md:mt-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>

                    {/* 👇 THE BUTTONS SHOW HERE */}
                    {renderActionButtons(apt)}

                    {/* <button
                      onClick={() => navigate(`/doctor/appointments/${apt._id}`)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      Details
                    </button> */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AppointmentsDoc;