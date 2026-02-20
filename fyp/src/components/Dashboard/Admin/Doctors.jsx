import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Doctors = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const API_BASE_URL = 'http://localhost:8085/api/v1/admin';

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchDoctors();
  }, [activeTab]);

  const fetchDoctors = async () => {
  try {
    setLoading(true);
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/doctors?status=${activeTab}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('API Response:', response.data); // ✅ Debug log
    
    if (response.data.success) {
      setDoctors(response.data.data || []);
    } else {
      console.error('API Error:', response.data.message);
      toast.error(response.data.message || 'Failed to fetch doctors');
      setDoctors([]);
    }
  } catch (error) {
    console.error('Error fetching doctors:', error.response?.data || error.message);
    toast.error('Failed to fetch doctors');
    setDoctors([]);
  } finally {
    setLoading(false);
  }
};

  const handleVerify = async (doctorId) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/doctors/${doctorId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Doctor verified successfully!');
        fetchDoctors(); // Refresh the list
      }
    } catch (error) {
      console.error('Error verifying doctor:', error);
      toast.error('Failed to verify doctor');
    }
  };

  const handleReject = async (doctorId, reason) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/doctors/${doctorId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Doctor rejected successfully!');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedDoctor(null);
        // If we're on pending tab, refresh to remove the rejected doctor
        if (activeTab === 'pending') {
          fetchDoctors();
        }
      }
    } catch (error) {
      console.error('Error rejecting doctor:', error);
      toast.error('Failed to reject doctor');
    }
  };

  const openRejectModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedDoctor(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">👨‍⚕️ Doctor Verification</h1>
        <div className="text-sm text-gray-600">
          Total: {doctors.length} doctors
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'pending', label: 'Pending Verification' },
            { key: 'verified', label: 'Verified Doctors' },
            { key: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Doctors List */}
      <div className="space-y-4">
        {doctors.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
            <p className="text-gray-500 text-lg">No doctors found</p>
            <p className="text-gray-400">There are no {activeTab} doctors at the moment.</p>
          </div>
        ) : (
          doctors.map((doctor) => (
            <div key={doctor.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                    {doctor.profilePicture ? (
                      <img 
                        src={doctor.profilePicture} 
                        alt={doctor.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-blue-600">👨‍⚕️</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{doctor.name}</h3>
                    <p className="text-gray-600">{doctor.specialization} • {doctor.experience}</p>
                    <p className="text-gray-500 text-sm">{doctor.email}</p>
                    <p className="text-gray-500 text-sm">License: {doctor.licenseNumber}</p>
                    {doctor.appliedDate && (
                      <p className="text-gray-500 text-sm">Applied: {formatDate(doctor.appliedDate)}</p>
                    )}
                    {doctor.rejectedAt && (
                      <p className="text-gray-500 text-sm">Rejected: {formatDate(doctor.rejectedAt)}</p>
                    )}
                    {doctor.certificates && doctor.certificates.length > 0 && (
                      <div className="flex space-x-2 mt-2">
                        {doctor.certificates.map((cert, index) => (
                          <a 
                            key={index} 
                            href={cert} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm hover:underline"
                          >
                            📄 Certificate {index + 1}
                          </a>
                        ))}
                      </div>
                    )}
                    {doctor.rejectionReason && (
                      <div className="mt-2">
                        <p className="text-red-600 text-sm font-medium">Rejection Reason:</p>
                        <p className="text-gray-600 text-sm">{doctor.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {activeTab === 'pending' && (
                    <>
                      <button
                        onClick={() => handleVerify(doctor.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(doctor)}
                        className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {activeTab === 'verified' && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Verified ✓
                    </span>
                  )}
                  
                  {activeTab === 'rejected' && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">Reject Doctor</h3>
            <p className="text-gray-600 mb-2">Please provide a reason for rejecting {selectedDoctor?.name}:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full border border-gray-300 rounded-lg p-3 mb-4"
              rows="3"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeRejectModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedDoctor.id, rejectReason)}
                disabled={!rejectReason.trim()}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;