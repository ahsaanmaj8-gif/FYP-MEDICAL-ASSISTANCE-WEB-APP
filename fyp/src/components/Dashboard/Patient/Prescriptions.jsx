import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

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
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
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
      <h1 className="text-2xl font-bold text-gray-900">My Prescriptions</h1>

      {prescriptions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-600">Your prescriptions from doctors will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions.map((pres) => (
            <div key={pres._id} className="bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-lg transition">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 text-white">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Prescription</h3>
                  <span className="text-sm">{formatDate(pres.createdAt)}</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="font-medium">{pres.doctor?.user?.name || 'Doctor'}</p>
                </div>

                {pres.diagnosis && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500">Diagnosis</p>
                    <p className="text-gray-700">{pres.diagnosis}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm text-gray-500 mb-2">Medicines ({pres.medicines?.length || 0})</p>
                  <div className="space-y-2">
                    {pres.medicines?.slice(0, 2).map((med, idx) => (
                      <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                        <span className="font-medium">{med.name}</span>
                        <span className="text-gray-600 ml-2">({med.dosage})</span>
                      </div>
                    ))}
                    {pres.medicines?.length > 2 && (
                      <p className="text-xs text-gray-500">+{pres.medicines.length - 2} more</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to={`/patient/prescriptions/${pres._id}`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;