import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const LabTests = () => {
  const [labTests, setLabTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLabTests();
  }, []);

  const fetchLabTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to view your lab tests');
        return;
      }

      console.log('Fetching lab tests...');
      
      const response = await axios.get('http://localhost:8085/api/v1/patient/lab-tests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Lab tests response:', response.data);

      if (response.data.success) {
        setLabTests(response.data.data);
        setError('');
      } else {
        setError(response.data.message || 'Failed to load lab tests');
      }
    } catch (error) {
      console.error('Error fetching lab tests:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Failed to load lab tests');
      toast.error('Failed to load lab tests');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'sample_collected':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  const formatTime = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your lab tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Lab Tests</h1>
        <Link
          to="/lab-tests"
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          + Book New Test
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3 text-red-500">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchLabTests}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {!error && labTests.length === 0 && (
        <div className="bg-white p-12 rounded-xl border text-center">
          <div className="text-6xl mb-4">🔬</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Lab Tests Booked</h3>
          <p className="text-gray-600 mb-6">You haven't booked any lab tests yet</p>
          <Link
            to="/lab-tests"
            className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 inline-block"
          >
            Browse Tests
          </Link>
        </div>
      )}

      {!error && labTests.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labTests.map((test) => (
            <div key={test._id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">{test.testName}</h3>
                  <p className="text-sm text-gray-600">{test.laboratory?.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(test.status)}`}>
                  {test.status?.replace('_', ' ') || 'Pending'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{test.patientName}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Booked on:</span>
                  <span className="font-medium">{formatDate(test.createdAt)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Collection:</span>
                  <span className="font-medium">
                    {formatDate(test.collectionDate)} at {formatTime(test.collectionDate)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium capitalize">{test.collectionType}</span>
                </div>
                
                {test.collectionType === 'home' && test.address && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Address:</span>
                    <span className="font-medium text-right">{test.address}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-teal-600">${test.amount || '0'}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Payment:</span>
                  <span className={`font-medium ${
                    test.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {test.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>

              {test.reportUrl && (
                <div className="mt-4">
                  <a
                    href={test.reportUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-teal-700 inline-block"
                  >
                    📄 Download Report
                  </a>
                </div>
              )}

              {test.status === 'completed' && !test.reportUrl && (
                <p className="text-xs text-green-600 mt-2">✅ Test completed. Report will be available soon.</p>
              )}

              {test.notes && (
                <p className="text-xs text-gray-500 mt-2">📝 Note: {test.notes}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LabTests;