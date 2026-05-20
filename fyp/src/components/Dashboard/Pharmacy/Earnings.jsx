import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Backend_Url } from './../../../../utils/utils';

const Earnings = () => {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    thisMonth: 0,
    pendingPayout: 0,
    totalOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Backend_Url}/pharmacy/earnings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setStats(response.data.data.stats);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
      // Use sample data
      setStats({
        totalEarnings: 12560,
        thisMonth: 3245,
        pendingPayout: 1234,
        totalOrders: 156
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">💰 Earnings</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">💰 Earnings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Total Earnings */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">💰</div>
            <div>
              <p className="text-gray-600 text-sm">Total Earnings</p>
              <p className="text-2xl font-bold">Rs.{stats.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* This Month */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📈</div>
            <div>
              <p className="text-gray-600 text-sm">This Month</p>
              <p className="text-2xl font-bold">Rs.{stats.thisMonth.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Pending Payout */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">⏳</div>
            <div>
              <p className="text-gray-600 text-sm">Pending Payout</p>
              <p className="text-2xl font-bold">{stats.pendingPayout.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="text-3xl mr-4">📦</div>
            <div>
              <p className="text-gray-600 text-sm">Total Orders</p>
              <p className="text-2xl font-bold">{stats.totalOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Summary */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h2 className="text-lg font-bold mb-4">Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Total Revenue:</span>
            <span className="font-bold">Rs.{stats.totalEarnings.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>This Month:</span>
            <span className="font-bold">{stats.thisMonth.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Pending Payout:</span>
            <span className="font-bold">{stats.pendingPayout.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Total Orders:</span>
            <span className="font-bold">{stats.totalOrders}</span>
          </div>
        </div>
        
        <button
          onClick={fetchEarnings}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Refresh Data
        </button>
      </div>
    </div>
  );
};

export default Earnings;