import React, { useState } from 'react';

const Settings = () => {
  const [commissionRates, setCommissionRates] = useState({
    doctor: 15,
    pharmacy: 10,
    laboratory: 8
  });

  const [platformStatus, setPlatformStatus] = useState({
    maintenance: false,
    emergencyMessage: ''
  });

  const handleCommissionChange = (service, value) => {
    setCommissionRates(prev => ({
      ...prev,
      [service]: parseInt(value) || 0
    }));
  };

  const handleSaveSettings = () => {
    console.log('Saving settings:', { commissionRates, platformStatus });
    // API call to save settings
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">⚙️ Platform Settings</h1>

      {/* Commission Rates */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">💰 Commission Rates</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              👨‍⚕️ Doctor Appointments
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={commissionRates.doctor}
                onChange={(e) => handleCommissionChange('doctor', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="50"
              />
              <span className="text-gray-600">%</span>
            </div>
            <p className="text-sm text-gray-500">Commission on doctor consultation fees</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              💊 Pharmacy Orders
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={commissionRates.pharmacy}
                onChange={(e) => handleCommissionChange('pharmacy', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="50"
              />
              <span className="text-gray-600">%</span>
            </div>
            <p className="text-sm text-gray-500">Commission on medicine orders</p>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              🔬 Laboratory Tests
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={commissionRates.laboratory}
                onChange={(e) => handleCommissionChange('laboratory', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="50"
              />
              <span className="text-gray-600">%</span>
            </div>
            <p className="text-sm text-gray-500">Commission on lab test bookings</p>
          </div>
        </div>
      </div>

      {/* Platform Status */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">🖥️ Platform Status</h2>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Mode
              </label>
              <p className="text-sm text-gray-500">
                Temporarily disable platform for maintenance
              </p>
            </div>
            <button
              onClick={() => setPlatformStatus(prev => ({ ...prev, maintenance: !prev.maintenance }))}
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                platformStatus.maintenance ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                  platformStatus.maintenance ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {platformStatus.maintenance && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maintenance Message
              </label>
              <textarea
                value={platformStatus.emergencyMessage}
                onChange={(e) => setPlatformStatus(prev => ({ ...prev, emergencyMessage: e.target.value }))}
                placeholder="Enter maintenance message for users..."
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveSettings}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default Settings;