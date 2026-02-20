import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('all');
  const [date, setDate] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, [status, date]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      let url = 'http://localhost:8085/api/v1/lab/appointments';
      
      const params = new URLSearchParams();
      if (status !== 'all') params.append('status', status);
      if (date) params.append('date', date);
      
      if (params.toString()) url += '?' + params.toString();

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAppointments(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8085/api/v1/lab/appointments/${appointmentId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Status updated');
      fetchAppointments();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">📅 Appointments</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl shadow-md border">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="all">All Appointments</option>
            <option value="scheduled">Scheduled</option>
            <option value="sample_collected">Sample Collected</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={() => { setStatus('all'); setDate(''); }}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white p-6 rounded-xl shadow-md border">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    appointment.collectionType === 'home' ? 'bg-green-100' : 'bg-blue-100'
                  }`}>
                    <span className="text-2xl">
                      {appointment.collectionType === 'home' ? '🚗' : '🏥'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{appointment.patientName}</h3>
                    <p className="text-gray-600">{appointment.testName}</p>
                    <p className="text-sm text-gray-500">
                      📞 {appointment.patientPhone}
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 {formatDate(appointment.collectionDate)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col md:items-end space-y-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'sample_collected' ? 'bg-blue-100 text-blue-800' :
                    appointment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {appointment.status.replace('_', ' ')}
                  </span>
                  
                  {appointment.status !== 'completed' && (
                    <select
                      onChange={(e) => updateStatus(appointment._id, e.target.value)}
                      className="border p-2 rounded text-sm"
                      defaultValue=""
                    >
                      <option value="" disabled>Update Status</option>
                      <option value="sample_collected">Sample Collected</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500">
            No appointments found
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;