import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Reports = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reportData, setReportData] = useState({
    reportFile: null,
    reportNotes: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch appointments WITHOUT reports (no reportUrl) AND status not 'completed'
      const response = await axios.get('http://localhost:8085/api/v1/lab/appointments', {
        headers: { Authorization: `Bearer ${token}` },
        params: { 
          limit: 50 
        }
      });
      
      if (response.data.success) {
        // Filter appointments that don't have reports yet
        const pendingReports = response.data.data.filter(appointment => 
          !appointment.reportUrl && appointment.status !== 'cancelled'
        );
        setAppointments(pendingReports);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check if it's PDF or image
      const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
      if (validTypes.includes(file.type)) {
        setReportData({...reportData, reportFile: file});
      } else {
        toast.error('Please upload PDF or image file (JPEG, PNG, GIF)');
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!reportData.reportFile) {
      toast.error('Please select a report file');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('reportFile', reportData.reportFile);
      formData.append('reportNotes', reportData.reportNotes);

      const response = await axios.post(
        `http://localhost:8085/api/v1/lab/appointments/${selectedAppointment}/report`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        toast.success('Report uploaded successfully');
        setShowUpload(false);
        setSelectedAppointment(null);
        setReportData({ reportFile: null, reportNotes: '' });
        fetchAppointments(); // Refresh the list
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload report');
    }
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8085/api/v1/lab/appointments/${appointmentId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Status updated to ${status}`);
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
      year: 'numeric'
    });
  };

  const getFileName = (file) => {
    if (!file) return 'No file selected';
    return file.name.length > 20 
      ? `${file.name.substring(0, 20)}...${file.name.substring(file.name.lastIndexOf('.'))}`
      : file.name;
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📋 Test Reports</h1>
        <div className="text-sm text-gray-600">
          {appointments.length} appointments need reports
        </div>
      </div>

      {/* Upload Form */}
      {showUpload && selectedAppointment && (
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-lg font-bold mb-4">Upload Report</h2>
          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Upload Report File *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  id="reportFile"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="reportFile" className="cursor-pointer">
                  <div className="text-4xl mb-2">📎</div>
                  <p className="text-gray-600 mb-2">Click to upload report</p>
                  <p className="text-sm text-gray-500">PDF, JPG, PNG, GIF (Max 10MB)</p>
                </label>
              </div>
              {reportData.reportFile && (
                <div className="mt-2 p-2 bg-green-50 rounded">
                  <p className="text-green-700">
                    ✅ Selected: {getFileName(reportData.reportFile)}
                  </p>
                  <p className="text-xs text-green-600">
                    Size: {(reportData.reportFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Report Notes (Optional)</label>
              <textarea
                placeholder="Any notes about the report, findings, recommendations..."
                value={reportData.reportNotes}
                onChange={(e) => setReportData({...reportData, reportNotes: e.target.value})}
                rows="3"
                className="border p-2 rounded w-full"
              />
            </div>
            
            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 flex items-center"
              >
                <span className="mr-2">📤</span> Upload & Mark as Completed
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUpload(false);
                  setSelectedAppointment(null);
                  setReportData({ reportFile: null, reportNotes: '' });
                }}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Appointments List - Only show those WITHOUT reports */}
      <div className="space-y-4">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="bg-white p-6 rounded-xl shadow-md border hover:shadow-lg transition-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start space-x-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    appointment.status === 'sample_collected' ? 'bg-blue-100' :
                    appointment.status === 'processing' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <span className={`text-2xl ${
                      appointment.status === 'sample_collected' ? 'text-blue-600' :
                      appointment.status === 'processing' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`}>
                      {appointment.status === 'sample_collected' ? '📦' :
                       appointment.status === 'processing' ? '⏳' : '📄'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{appointment.patientName || 'Patient'}</h3>
                    <p className="text-gray-600 font-medium">{appointment.testName || 'Test'}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="text-sm text-gray-500">
                        📅 {formatDate(appointment.collectionDate || appointment.createdAt)}
                      </span>
                      <span className="text-sm text-gray-500">
                        📞 {appointment.patientPhone || 'N/A'}
                      </span>
                      <span className="text-sm text-gray-500">
                        💰 ${appointment.amount || 0}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'sample_collected' 
                          ? 'bg-blue-100 text-blue-800'
                          : appointment.status === 'processing'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {appointment.status ? appointment.status.replace('_', ' ').toUpperCase() : 'PENDING'}
                      </span>
                    </div>
                    
                    {appointment.notes && (
                      <p className="text-sm text-gray-600 mt-2">
                        📝 {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col md:items-end space-y-3">
                  {/* Check if report already exists */}
                  {appointment.reportUrl ? (
                    <div className="text-center">
                      <span className="text-green-600 font-medium">✅ Report Uploaded</span>
                      <a
                        href={appointment.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-blue-600 hover:text-blue-800 text-sm mt-1"
                      >
                        View Report →
                      </a>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment._id);
                          setShowUpload(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm flex items-center"
                      >
                        <span className="mr-2">📎</span> Upload Report
                      </button>
                      
                      {/* Status update buttons */}
                      <div className="flex space-x-2">
                        {appointment.status === 'sample_collected' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'processing')}
                            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 text-xs"
                          >
                            Mark Processing
                          </button>
                        )}
                        {appointment.status === 'processing' && (
                          <button
                            onClick={() => updateAppointmentStatus(appointment._id, 'completed')}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-xs"
                          >
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              {/* Warning if no report yet */}
              {!appointment.reportUrl && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-yellow-600 mr-2">⚠️</span>
                    <span className="text-yellow-700 font-medium">Report Pending</span>
                    <span className="text-yellow-600 text-sm ml-2">
                      Upload report to complete this appointment
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-semibold mb-2 text-gray-800">All Reports Uploaded!</h3>
            <p className="text-gray-600">No pending reports to process.</p>
            <button
              onClick={fetchAppointments}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Status Legend */}
      <div className="bg-gray-50 p-4 rounded-xl border">
        <h3 className="font-bold text-gray-800 mb-3">📊 Status Legend</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
            <span className="text-sm">Sample Collected</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
            <span className="text-sm">Processing</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
            <span className="text-sm">Report Pending</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;