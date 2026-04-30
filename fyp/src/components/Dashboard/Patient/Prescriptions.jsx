import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/patient/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPrescriptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleViewDetails = (id) => {
    navigate(`/patient/prescriptions/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>
        <span className="text-sm text-gray-500">
          Total: {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-600">Your prescriptions from doctors will appear here</p>
          <Link
            to="/doctors"
            className="mt-4 inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((pres) => (
            <div 
              key={pres._id} 
              className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition cursor-pointer"
              onClick={() => handleViewDetails(pres._id)}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📄</span>
                    <h3 className="font-bold">Prescription</h3>
                  </div>
                  <span className="text-sm">{formatDate(pres.createdAt)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium text-gray-900">{pres.doctor?.user?.name || 'Doctor'}</p>
                  <p className="text-xs text-gray-500">{pres.doctor?.specialization || 'General Physician'}</p>
                </div>

                {pres.diagnosis && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="text-gray-700 text-sm line-clamp-2">{pres.diagnosis}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">
                    💊 Medicines ({pres.medicines?.length || 0})
                  </p>
                  <div className="space-y-2">
                    {pres.medicines?.slice(0, 2).map((med, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded flex justify-between items-center">
                        <span className="font-medium text-gray-800">{med.name}</span>
                        <span className="text-gray-500 text-xs">{med.dosage}</span>
                      </div>
                    ))}
                    {pres.medicines?.length > 2 && (
                      <p className="text-xs text-purple-600">
                        +{pres.medicines.length - 2} more medicine{pres.medicines.length - 2 !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>

                {pres.followUpDate && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Follow-up</p>
                    <p className="text-sm text-green-600">{formatDate(pres.followUpDate)}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <span>🏥</span>
                    <span>MediCare</span>
                  </div>
                  <button 
                    onClick={() => handleViewDetails(pres._id)}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    View Details 
                    <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Action Buttons */}
      {prescriptions.length > 0 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => navigate('/doctors')}
            className="px-5 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition"
          >
            + Book New Appointment
          </button>
          <button
            onClick={() => navigate('/pharmacy')}
            className="px-5 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm hover:bg-purple-50 transition"
          >
            💊 Order Medicines
          </button>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;