import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Backend_Url}/patient/appointments`, {
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

  const cancelAppointment = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${Backend_Url}/patient/appointments/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Appointment cancelled');
        fetchAppointments(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to cancel appointment');
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        <Link
          to="/doctors"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Book New
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Appointments Yet</h3>
          <p className="text-gray-600 mb-6">Book your first appointment with a specialist</p>
          <Link
            to="/doctors"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 inline-block"
          >
            Find Doctors
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{apt.doctor}</p>
                        <p className="text-sm text-gray-500">{apt.specialty}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{formatDate(apt.date)}</p>
                      <p className="text-sm text-gray-500">{formatTime(apt.time)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700">{apt.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>





                    {/* // For video consultation appointments */}
{/* {apt.appointmentType === 'video-consultation' && apt.status === 'in-progress' && (
  <button
    onClick={() => navigate(`/video/call/${apt._id}`)}
    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
  >
    Join Video Call
  </button>
)} */}


<td>

{/* // Add this where you show action buttons */}
{apt.type === 'Video Consultation' && apt.status === 'in-progress' && (
  
  <button
    onClick={async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `${Backend_Url}/video/appointment/${apt._id}/room`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (response.data.success) {
          // Open in new tab
          window.open(response.data.data.meetingUrl, '_blank');
        }
      } catch (error) {
        console.error('Error joining video:', error);
        toast.error('Failed to join video consultation');
      }
    }}
    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
  >
    Join Video Call (meet.jit.si)
  </button>
)}
</td>



                    {/* <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Link
                          to={`/appointment/${apt._id}`}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          View
                        </Link>
                        {apt.status === 'scheduled' && (
                          <button
                            onClick={() => cancelAppointment(apt._id)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointments;