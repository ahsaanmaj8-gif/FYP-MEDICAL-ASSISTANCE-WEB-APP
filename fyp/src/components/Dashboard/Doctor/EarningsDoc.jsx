import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const EarningsDoc = () => {
  const [earnings, setEarnings] = useState({
    totalEarnings: 0,
    thisMonthEarnings: 0,
    totalConsultations: 0,
    thisMonthConsultations: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/doctor/earnings', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setEarnings(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">💰 Earnings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Earnings */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-purple-100 text-sm">Total Earnings</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(earnings.totalEarnings)}</p>
              <p className="text-purple-100 text-xs mt-2">All time</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-green-100 text-sm">This Month</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(earnings.thisMonthEarnings)}</p>
              <p className="text-green-100 text-xs mt-2">{earnings.thisMonthConsultations} consultations</p>
            </div>
            <div className="text-3xl">📈</div>
          </div>
        </div>

        {/* Total Consultations */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Total Consultations</p>
              <p className="text-3xl font-bold mt-2">{earnings.totalConsultations}</p>
              <p className="text-blue-100 text-xs mt-2">Completed appointments</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-2xl shadow-lg border p-6">
        <h2 className="text-lg font-bold mb-4">Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Average per consultation:</span>
              <span className="font-bold">
                {earnings.totalConsultations > 0 
                  ? formatCurrency(earnings.totalEarnings / earnings.totalConsultations)
                  : '$0.00'}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">This month's average:</span>
              <span className="font-bold">
                {earnings.thisMonthConsultations > 0
                  ? formatCurrency(earnings.thisMonthEarnings / earnings.thisMonthConsultations)
                  : '$0.00'}
              </span>
            </div>
          </div>
          <div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Consultation fee:</span>
              <span className="font-bold">$50.00</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Follow-up fee:</span>
              <span className="font-bold">$30.00</span>
            </div>
          </div>
        </div>

        <button
          onClick={fetchEarnings}
          className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default EarningsDoc;