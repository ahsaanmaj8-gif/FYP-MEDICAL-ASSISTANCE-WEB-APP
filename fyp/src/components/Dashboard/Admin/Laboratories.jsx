import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const Laboratories = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [laboratories, setLaboratories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLab, setSelectedLab] = useState(null);

  const API_BASE_URL = `${Backend_Url}/admin`;

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchLaboratories();
  }, [activeTab]);

 const fetchLaboratories = async () => {
  try {
    setLoading(true);
    const token = getAuthToken();
    console.log('Fetching laboratories with status:', activeTab); // ✅ DEBUG
    
    const response = await axios.get(`${API_BASE_URL}/laboratories?status=${activeTab}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Laboratories API Response:', response.data); // ✅ DEBUG
    
    if (response.data.success) {
      setLaboratories(response.data.data || []);
    } else {
      console.error('API Error:', response.data.message);
      toast.error(response.data.message || 'Failed to fetch laboratories');
      setLaboratories([]);
    }
  } catch (error) {
    console.error('Error fetching laboratories:', error.response?.data || error.message);
    toast.error('Failed to fetch laboratories');
    setLaboratories([]);
  } finally {
    setLoading(false);
  }
};

  const handleVerify = async (labId) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/laboratories/${labId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Laboratory verified successfully!');
        fetchLaboratories();
      }
    } catch (error) {
      console.error('Error verifying laboratory:', error);
      toast.error('Failed to verify laboratory');
    }
  };

  const handleReject = async (labId, reason) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/laboratories/${labId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Laboratory rejected successfully!');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedLab(null);
        if (activeTab === 'pending') {
          fetchLaboratories();
        }
      }
    } catch (error) {
      console.error('Error rejecting laboratory:', error);
      toast.error('Failed to reject laboratory');
    }
  };

  const openRejectModal = (lab) => {
    setSelectedLab(lab);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedLab(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAddress = (address) => {
    if (!address) return 'No address provided';
    const { street, city, state, zipCode, country } = address;
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">🔬 Laboratory Verification</h1>
        <div className="text-sm text-gray-600">
          Total: {laboratories.length} labs
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'pending', label: 'Pending Verification' },
            { key: 'verified', label: 'Verified Labs' },
            { key: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Laboratories List */}
      <div className="space-y-4">
        {laboratories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔬</div>
            <p className="text-gray-500 text-lg">No laboratories found</p>
            <p className="text-gray-400">There are no {activeTab} laboratories at the moment.</p>
          </div>
        ) : (
          laboratories.map((lab) => (
            <div key={lab.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center">
                    {lab.profilePicture ? (
                      <img 
                        src={lab.profilePicture} 
                        alt={lab.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-teal-600">🔬</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{lab.name}</h3>
                    <p className="text-gray-600">Owner: {lab.owner}</p>
                    <p className="text-gray-500 text-sm">{lab.email}</p>
                    <p className="text-gray-500 text-sm">License: {lab.licenseNumber}</p>
                    <p className="text-gray-500 text-sm">Address: {formatAddress(lab.address)}</p>
                    {lab.appliedDate && (
                      <p className="text-gray-500 text-sm">Applied: {formatDate(lab.appliedDate)}</p>
                    )}
                    {lab.rejectedAt && (
                      <p className="text-gray-500 text-sm">Rejected: {formatDate(lab.rejectedAt)}</p>
                    )}
                    {lab.homeCollectionAvailable && (
                      <p className="text-green-600 text-sm mt-1">🏠 Home Collection Available</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {lab.testsAvailable && lab.testsAvailable.slice(0, 3).map((test, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {test.testName}
                        </span>
                      ))}
                      {lab.testsAvailable && lab.testsAvailable.length > 3 && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          +{lab.testsAvailable.length - 3} more
                        </span>
                      )}
                    </div>
                    {lab.rejectionReason && (
                      <div className="mt-2">
                        <p className="text-red-600 text-sm font-medium">Rejection Reason:</p>
                        <p className="text-gray-600 text-sm">{lab.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {activeTab === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleVerify(lab.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => openRejectModal(lab)}
                        className="bg-red-600 text-white px-6 py-2 rounded-xl hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  
                  {activeTab === 'verified' && (
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        Verified ✓
                      </span>
                    </div>
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
            <h3 className="text-lg font-bold mb-4">Reject Laboratory</h3>
            <p className="text-gray-600 mb-2">Please provide a reason for rejecting {selectedLab?.name}:</p>
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
                onClick={() => handleReject(selectedLab.id, rejectReason)}
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

export default Laboratories;