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
        `http://localhost:8085/api/v1/patient/prescriptions/${id}`,
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

  const printPrescription = () => {
    window.print();
  };

  const downloadPrescription = () => {
    // Create printable version
    const printContent = document.getElementById('prescription-content').innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
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
          onClick={() => navigate('/patient/prescriptions')}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          Back to Prescriptions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Prescription Details</h1>
        <div className="flex space-x-3">
          <button
            onClick={printPrescription}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
          >
            🖨️ Print
          </button>
          <button
            onClick={() => navigate('/patient/prescriptions')}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Prescription Card */}
      <div id="prescription-content">
        <div className={`bg-white rounded-2xl shadow-lg border overflow-hidden ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Medical Prescription</h2>
                <p className="text-purple-100 mt-1">Issued by MediCare</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-purple-100">Prescription ID</div>
                <div className="font-mono text-sm">{prescription._id?.slice(-8).toUpperCase()}</div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Doctor & Patient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-6 border-b">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Doctor Information</h3>
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">Dr. {prescription.doctor?.user?.name || 'Doctor'}</p>
                  <p className="text-sm text-gray-600">{prescription.doctor?.specialization || 'General Physician'}</p>
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <span className="mr-1">📅</span>
                    <span>Issued: {formatDate(prescription.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Patient Information</h3>
                <div className="space-y-1">
                  <p className="font-bold text-gray-800">{prescription.patient?.name || 'Patient'}</p>
                  {prescription.appointment && (
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-1">📅</span>
                      <span>Appointment: {formatDate(prescription.appointment.appointmentDate)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnosis */}
            {prescription.diagnosis && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Diagnosis</h3>
                <p className="text-gray-800">{prescription.diagnosis}</p>
              </div>
            )}

            {/* Medicines */}
            <div className="mb-6 pb-4 border-b">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">Prescribed Medicines</h3>
              {prescription.medicines?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Medicine</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Dosage</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Frequency</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {prescription.medicines.map((med, index) => (
                        <tr key={index}>
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
                <p className="text-gray-500 text-sm">No medicines prescribed</p>
              )}
            </div>

            {/* Tests */}
            {prescription.tests?.length > 0 && (
              <div className="mb-6 pb-4 border-b">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Recommended Tests</h3>
                <div className="space-y-2">
                  {prescription.tests.map((test, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">🔬</span>
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
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Instructions</h3>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{prescription.instructions}</p>
                </div>
              </div>
            )}

            {/* Follow-up */}
            {prescription.followUpDate && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Follow-up</h3>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📅</span>
                    <div>
                      <p className="font-medium text-gray-800">Next Appointment</p>
                      <p className="text-gray-600">{formatDate(prescription.followUpDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t text-center">
              <div className="flex justify-center gap-8 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <span>🏥</span>
                  <span>MediCare Healthcare</span>
                </div>
                <div className="flex items-center gap-1">
                  <span>📞</span>
                  <span>Emergency: 911</span>
                </div>
              </div>
              <p className="text-xs text-gray-400 mt-4">
                This is a digital prescription. No physical signature required.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons at Bottom */}
      <div className="flex justify-center gap-4">
        <button
          onClick={downloadPrescription}
          className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition shadow-md flex items-center gap-2"
        >
          📄 Download PDF
        </button>
        <button
          onClick={() => navigate('/patient/pharmacy')}
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition shadow-md flex items-center gap-2"
        >
          💊 Order Medicines
        </button>
      </div>
    </div>
  );
};

export default PrescriptionDetails;