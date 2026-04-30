import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ThemeContext } from '../../../context/ThemeContext';

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPrescription();
  }, [id]);

  const fetchPrescription = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.get(
        `http://localhost:8085/api/v1/doctor/prescriptions/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setPrescription(response.data.data);
      } else {
        setError('Prescription not found');
      }
    } catch (error) {
      console.error('Error fetching prescription:', error);
      setError(error.response?.data?.message || 'Failed to load prescription');
      toast.error('Failed to load prescription');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
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

  const printPrescription = () => {
    window.print();
  };

  const downloadPrescription = () => {
    const printWindow = window.open('', '_blank');
    const printContent = document.getElementById('prescription-content').innerHTML;
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription - ${prescription.patient?.name || 'Patient'}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .prescription-card { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #7c3aed; }
            .section { margin-bottom: 20px; border-bottom: 1px solid #e5e7eb; padding-bottom: 15px; }
            .section-title { font-weight: bold; color: #6b7280; font-size: 14px; margin-bottom: 10px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f9fafb; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          </style>
        </head>
        <body>
          <div class="prescription-card">
            ${printContent}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prescription...</p>
        </div>
      </div>
    );
  }

  if (error || !prescription) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
        <div className="text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Prescription Not Found</h3>
        <p className="text-gray-600 mb-6">{error || 'The prescription you\'re looking for doesn\'t exist.'}</p>
        <button
          onClick={() => navigate('/doctor/prescriptions')}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          Back to Prescriptions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
        <div className="flex space-x-3">
          <button
            onClick={printPrescription}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2 transition"
          >
            🖨️ Print
          </button>
          <button
            onClick={downloadPrescription}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 transition"
          >
            📥 Download PDF
          </button>
          <button
            onClick={() => navigate('/doctor/prescriptions')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Prescription Card */}
      <div id="prescription-content">
        <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-6 text-white">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">📋</span>
                  <h2 className="text-2xl font-bold">Medical Prescription</h2>
                </div>
                <p className="text-green-100 text-sm">Issued by MediCare Healthcare</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-100">Prescription ID</div>
                <div className="font-mono text-sm bg-white/20 px-3 py-1 rounded-full">
                  #{prescription._id?.slice(-8).toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">👨‍⚕️ Doctor Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 text-lg">Dr. {prescription.doctor?.user?.name || 'Doctor'}</p>
                  <p className="text-sm text-gray-600 mt-1">{prescription.doctor?.specialization || 'General Physician'}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="mr-1">📅</span>
                    <span>Issued on: {formatDate(prescription.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">👤 Patient Information</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-bold text-gray-800 text-lg">{prescription.patient?.name || 'Patient'}</p>
                  {prescription.patient?.phone && (
                    <p className="text-sm text-gray-600 mt-1">📞 {prescription.patient.phone}</p>
                  )}
                  {prescription.appointment && (
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <span className="mr-1">📅</span>
                      <span>Appointment: {formatDate(prescription.appointment.appointmentDate)} at {formatTime(prescription.appointment.appointmentTime)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">🔍 Diagnosis</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-800">{prescription.diagnosis}</p>
                </div>
              </div>
            )}

            {/* Medicines */}
            <div className="mb-6 pb-4 border-b">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">💊 Prescribed Medicines</h3>
              {prescription.medicines?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Medicine Name</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Dosage</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Frequency</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {prescription.medicines.map((med, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-800">{med.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.dosage || 'As directed'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.frequency || 'As needed'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{med.duration || 'As prescribed'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm italic">No medicines prescribed</p>
              )}
            </div>

            {/* Tests */}
            {prescription.tests?.length > 0 && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">🔬 Recommended Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prescription.tests.map((test, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-xl">🔬</span>
                      <div>
                        <p className="font-medium text-gray-800">{test.name}</p>
                        {test.description && <p className="text-sm text-gray-500">{test.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            {prescription.instructions && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">📝 Instructions for Patient</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{prescription.instructions}</p>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {prescription.followUpDate && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">📅 Follow-up Schedule</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <p className="font-medium text-gray-800">Next Appointment Recommended</p>
                      <p className="text-gray-600">{formatDate(prescription.followUpDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span>🏥</span>
                  <span>MediCare Healthcare System</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>⚕️</span>
                  <span>Digitally Signed Prescription</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 text-center mt-4">
                This is a valid electronic prescription. No physical signature required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex justify-center gap-4 flex-wrap">
        <button
          onClick={() => navigate(`/doctor/patients/${prescription.patient?._id}`)}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow-md flex items-center gap-2"
        >
          👤 View Patient Profile
        </button>
        <button
          onClick={() => navigate(`/doctor/appointments`)}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2"
        >
          📅 View Appointments
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetails;