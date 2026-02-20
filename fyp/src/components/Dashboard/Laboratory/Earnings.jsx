import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    totalAmount: 0,
    totalAppointments: 0,
    popularTests: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    fetchEarnings();
  }, [period]);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8085/api/v1/lab/earnings?period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setEarnings(response.data.data);
      }
    } catch (error) {
      toast.error('Failed to load earnings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">💰 Earnings</h1>
        <div className="flex space-x-2">
          {['weekly', 'monthly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded capitalize ${
                period === p
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Total Revenue</h2>
            <p className="text-blue-100">This {period}</p>
            <div className="text-4xl font-bold mt-4">${earnings.totalAmount}</div>
            <p className="text-green-300 mt-2">{earnings.totalAppointments} appointments</p>
          </div>
          <div className="text-5xl">💰</div>
        </div>
      </div>

      {/* Popular Tests */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-bold mb-6">🔥 Popular Tests</h2>
        <div className="space-y-4">
          {earnings.popularTests.length > 0 ? (
            earnings.popularTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-xl text-blue-600">🧪</span>
                  </div>
                  <div>
                    <h3 className="font-semibold">{test._id}</h3>
                    <p className="text-gray-600 text-sm">{test.count} tests</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold">${test.totalRevenue}</div>
                  <div className="text-green-500 text-sm">
                    {Math.round((test.totalRevenue / earnings.totalAmount) * 100)}% of total
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No data available</p>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border text-center">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-2xl font-bold">{earnings.totalAppointments}</div>
          <div className="text-gray-600">Tests Conducted</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border text-center">
          <div className="text-2xl mb-2">💰</div>
          <div className="text-2xl font-bold">
            ${earnings.totalAppointments > 0 ? Math.round(earnings.totalAmount / earnings.totalAppointments) : 0}
          </div>
          <div className="text-gray-600">Avg. per Test</div>
        </div>
        {/* <div className="bg-white p-6 rounded-xl shadow-md border text-center">
          <div className="text-2xl mb-2">⭐</div>
          <div className="text-2xl font-bold">4.8</div>
          <div className="text-gray-600">Customer Rating</div>
        </div> */}
      </div>
    </div>
  );
};

export default Earnings;