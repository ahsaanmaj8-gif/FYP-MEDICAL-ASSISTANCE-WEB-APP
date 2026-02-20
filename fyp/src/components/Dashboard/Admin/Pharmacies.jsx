import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Pharmacies = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const API_BASE_URL = 'http://localhost:8085/api/v1/admin';

  const getAuthToken = () => localStorage.getItem('token');

  useEffect(() => {
    fetchPharmacies();
  }, [activeTab]);

  // const fetchPharmacies = async () => {
  //   try {
  //     setLoading(true);
  //     const token = getAuthToken();
  //     const response = await axios.get(`${API_BASE_URL}/pharmacies?status=${activeTab}`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
      
  //     if (response.data.success) {
  //       setPharmacies(response.data.data);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching pharmacies:', error);
  //     toast.error('Failed to fetch pharmacies');
  //     setPharmacies([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };




  const fetchPharmacies = async () => {
  try {
    setLoading(true);
    const token = getAuthToken();
    console.log('Fetching pharmacies with status:', activeTab); // ✅ DEBUG
    
    const response = await axios.get(`${API_BASE_URL}/pharmacies?status=${activeTab}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('Pharmacies API Response:', response.data); // ✅ DEBUG
    
    if (response.data.success) {
      setPharmacies(response.data.data || []);
    } else {
      console.error('API Error:', response.data.message);
      toast.error(response.data.message || 'Failed to fetch pharmacies');
      setPharmacies([]);
    }
  } catch (error) {
    console.error('Error fetching pharmacies:', error.response?.data || error.message);
    toast.error('Failed to fetch pharmacies');
    setPharmacies([]);
  } finally {
    setLoading(false);
  }
};
  const handleVerify = async (pharmacyId) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/pharmacies/${pharmacyId}/verify`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Pharmacy verified successfully!');
        fetchPharmacies();
      }
    } catch (error) {
      console.error('Error verifying pharmacy:', error);
      toast.error('Failed to verify pharmacy');
    }
  };

  const handleReject = async (pharmacyId, reason) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(
        `${API_BASE_URL}/pharmacies/${pharmacyId}/reject`,
        { reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        toast.success('Pharmacy rejected successfully!');
        setShowRejectModal(false);
        setRejectReason('');
        setSelectedPharmacy(null);
        if (activeTab === 'pending') {
          fetchPharmacies();
        }
      }
    } catch (error) {
      console.error('Error rejecting pharmacy:', error);
      toast.error('Failed to reject pharmacy');
    }
  };

  const openRejectModal = (pharmacy) => {
    setSelectedPharmacy(pharmacy);
    setShowRejectModal(true);
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setRejectReason('');
    setSelectedPharmacy(null);
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">💊 Pharmacy Verification</h1>
        <div className="text-sm text-gray-600">
          Total: {pharmacies.length} pharmacies
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { key: 'pending', label: 'Pending Verification' },
            { key: 'verified', label: 'Verified Pharmacies' },
            { key: 'rejected', label: 'Rejected' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.key
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Pharmacies List */}
      <div className="space-y-4">
        {pharmacies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">💊</div>
            <p className="text-gray-500 text-lg">No pharmacies found</p>
            <p className="text-gray-400">There are no {activeTab} pharmacies at the moment.</p>
          </div>
        ) : (
          pharmacies.map((pharmacy) => (
            <div key={pharmacy.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                    {pharmacy.profilePicture ? (
                      <img 
                        src={pharmacy.profilePicture} 
                        alt={pharmacy.name}
                        className="w-16 h-16 rounded-2xl object-cover"
                      />
                    ) : (
                      <span className="text-2xl text-purple-600">💊</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{pharmacy.name}</h3>
                    <p className="text-gray-600">Owner: {pharmacy.owner}</p>
                    <p className="text-gray-500 text-sm">{pharmacy.email}</p>
                    <p className="text-gray-500 text-sm">License: {pharmacy.licenseNumber}</p>
                    <p className="text-gray-500 text-sm">Address: {formatAddress(pharmacy.address)}</p>
                    {pharmacy.appliedDate && (
                      <p className="text-gray-500 text-sm">Applied: {formatDate(pharmacy.appliedDate)}</p>
                    )}
                    {pharmacy.rejectedAt && (
                      <p className="text-gray-500 text-sm">Rejected: {formatDate(pharmacy.rejectedAt)}</p>
                    )}
                    {pharmacy.deliveryAvailable && (
                      <p className="text-green-600 text-sm mt-1">
                        🚚 Delivery Available ({pharmacy.deliveryRadius} km)
                      </p>
                    )}
                    {pharmacy.rejectionReason && (
                      <div className="mt-2">
                        <p className="text-red-600 text-sm font-medium">Rejection Reason:</p>
                        <p className="text-gray-600 text-sm">{pharmacy.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  {activeTab === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleVerify(pharmacy.id)}
                        className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button 
                        onClick={() => openRejectModal(pharmacy)}
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
            <h3 className="text-lg font-bold mb-4">Reject Pharmacy</h3>
            <p className="text-gray-600 mb-2">Please provide a reason for rejecting {selectedPharmacy?.name}:</p>
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
                onClick={() => handleReject(selectedPharmacy.id, rejectReason)}
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

export default Pharmacies;