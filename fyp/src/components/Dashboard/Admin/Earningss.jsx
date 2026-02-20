import React, { useState } from 'react';

const Earningss = () => {
  const [timeRange, setTimeRange] = useState('monthly');

  const earningsData = {
    monthly: {
      total: 12458,
      doctorCommissions: 8450,
      pharmacyCommissions: 2850,
      labCommissions: 1158,
      growth: '+15%'
    },
    weekly: {
      total: 3240,
      doctorCommissions: 2150,
      pharmacyCommissions: 680,
      labCommissions: 410,
      growth: '+8%'
    }
  };

  const currentData = earningsData[timeRange];

  const transactions = [
    { id: 1, type: 'Doctor Commission', amount: 45, date: '2024-01-15', status: 'completed' },
    { id: 2, type: 'Pharmacy Order', amount: 12, date: '2024-01-15', status: 'completed' },
    { id: 3, type: 'Lab Test', amount: 8, date: '2024-01-14', status: 'completed' },
    { id: 4, type: 'Doctor Commission', amount: 35, date: '2024-01-14', status: 'completed' }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">💰 Platform Earnings</h1>
        <div className="flex space-x-2">
          {['weekly', 'monthly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium capitalize ${
                timeRange === range
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Main Earnings Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">Total Earnings</h2>
            <p className="text-blue-100 text-lg">This {timeRange}</p>
            <div className="text-4xl font-bold mt-4">${currentData.total.toLocaleString()}</div>
            <div className="text-green-300 text-lg mt-2">{currentData.growth} from last {timeRange}</div>
          </div>
          <div className="text-right">
            <div className="text-3xl">💰</div>
          </div>
        </div>
      </div>

      {/* Commission Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl mb-2">👨‍⚕️</div>
          <div className="text-2xl font-bold text-gray-900">${currentData.doctorCommissions.toLocaleString()}</div>
          <div className="text-gray-600">Doctor Commissions</div>
          <div className="text-green-500 text-sm mt-1">65% of total</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl mb-2">💊</div>
          <div className="text-2xl font-bold text-gray-900">${currentData.pharmacyCommissions.toLocaleString()}</div>
          <div className="text-gray-600">Pharmacy Commissions</div>
          <div className="text-blue-500 text-sm mt-1">25% of total</div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-2xl mb-2">🔬</div>
          <div className="text-2xl font-bold text-gray-900">${currentData.labCommissions.toLocaleString()}</div>
          <div className="text-gray-600">Lab Commissions</div>
          <div className="text-purple-500 text-sm mt-1">10% of total</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center">
                  <span className="text-xl">
                    {transaction.type.includes('Doctor') ? '👨‍⚕️' : 
                     transaction.type.includes('Pharmacy') ? '💊' : '🔬'}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{transaction.type}</h3>
                  <p className="text-gray-600 text-sm">{transaction.date}</p>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-bold text-gray-900">${transaction.amount}</div>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Earningss;