import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import { Backend_Url } from './../../../../utils/utils';

const PrescriptionsDoc = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get('appointment');

  const [formData, setFormData] = useState({
    appointmentId: appointmentId || '',
    diagnosis: '',
    medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
    tests: [{ name: '', description: '' }],
    instructions: '',
    followUpDate: ''
  });

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  useEffect(() => {
    if (showForm) {
      fetchAppointments();
    }
  }, [showForm]);

  // When appointmentId is passed in URL, auto-select it
  useEffect(() => {
    if (appointmentId) {
      setFormData(prev => ({ ...prev, appointmentId }));
      setShowForm(true);
    }
  }, [appointmentId]);

  const fetchPrescriptions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Backend_Url}/doctor/prescriptions`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPrescriptions(response.data.data);
        // console.log(response.data.data);
        
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch ALL completed appointments
      const response = await axios.get(`${Backend_Url}/doctor/appointments?filter=completed`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        // Show appointments that don't have prescriptions yet
        const appointmentsWithoutPrescription = response.data.data.filter(apt => 
          !apt.prescription
        );
        setAppointments(appointmentsWithoutPrescription);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [...formData.medicines, { name: '', dosage: '', frequency: '', duration: '' }]
    });
  };

  const removeMedicine = (index) => {
    const updated = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: updated });
  };

  const updateMedicine = (index, field, value) => {
    const updated = formData.medicines.map((med, i) => 
      i === index ? { ...med, [field]: value } : med
    );
    setFormData({ ...formData, medicines: updated });
  };

  const addTest = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, { name: '', description: '' }]
    });
  };

  const removeTest = (index) => {
    const updated = formData.tests.filter((_, i) => i !== index);
    setFormData({ ...formData, tests: updated });
  };

  const updateTest = (index, field, value) => {
    const updated = formData.tests.map((test, i) => 
      i === index ? { ...test, [field]: value } : test
    );
    setFormData({ ...formData, tests: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.appointmentId) {
      toast.error('Please select an appointment');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${Backend_Url}/doctor/prescriptions`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success('Prescription created successfully');
        setShowForm(false);
        fetchPrescriptions();
        setFormData({
          appointmentId: '',
          diagnosis: '',
          medicines: [{ name: '', dosage: '', frequency: '', duration: '' }],
          tests: [{ name: '', description: '' }],
          instructions: '',
          followUpDate: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  const viewPrescription = (id) => {
    navigate(`/doctor/prescriptions/${id}`);
  };

 const formatDate = (prescription) => {
  // Try multiple date fields
  const dateValue = prescription?.issuedDate || prescription?.createdAt || prescription?.updatedAt;
  
  if (!dateValue) return 'N/A';
  
  try {
    return new Date(dateValue).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return 'Invalid Date';
  }
};

  const getMedicineCount = (medicines) => {
    if (!medicines || medicines.length === 0) return 0;
    return medicines.length;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total: {prescriptions.length} prescription{prescriptions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
        >
          <span>{showForm ? '✕' : '+'}</span>
          {showForm ? 'Cancel' : 'New Prescription'}
        </button>
      </div>

      {/* New Prescription Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-900">Create New Prescription</h2>
            {appointmentId && (
              <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Auto-selected from appointment
              </span>
            )}
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Appointment Selection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Select Appointment *
              </label>
              <select
                value={formData.appointmentId}
                onChange={(e) => setFormData({ ...formData, appointmentId: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Choose an appointment</option>
                {appointments.length === 0 ? (
                  <option value="" disabled>No completed appointments available</option>
                ) : (
                  appointments.map(apt => (
                    <option key={apt._id} value={apt._id}>
                      {apt.patient?.name} - {formatDate(apt.appointmentDate)} at {apt.appointmentTime}
                    </option>
                  ))
                )}
              </select>
              {appointments.length === 0 && (
                <p className="text-sm text-yellow-600 mt-2 flex items-center gap-1">
                  <span>⚠️</span>
                  No completed appointments without prescriptions. Complete an appointment first.
                </p>
              )}
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., Acute bronchitis, Hypertension"
              />
            </div>

            {/* Medicines */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Medicines
              </label>
              <div className="space-y-3">
                {formData.medicines.map((medicine, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-3 border rounded-lg bg-gray-50">
                    <input
                      placeholder="Medicine name"
                      value={medicine.name}
                      onChange={(e) => updateMedicine(index, 'name', e.target.value)}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      placeholder="Dosage"
                      value={medicine.dosage}
                      onChange={(e) => updateMedicine(index, 'dosage', e.target.value)}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      placeholder="Frequency"
                      value={medicine.frequency}
                      onChange={(e) => updateMedicine(index, 'frequency', e.target.value)}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      placeholder="Duration"
                      value={medicine.duration}
                      onChange={(e) => updateMedicine(index, 'duration', e.target.value)}
                      className="px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    {formData.medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeMedicine(index)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addMedicine}
                  className="text-sm text-green-600 hover:text-green-700 transition flex items-center gap-1"
                >
                  <span>+</span> Add Medicine
                </button>
              </div>
            </div>

            {/* Tests */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Recommended Tests
              </label>
              <div className="space-y-3">
                {formData.tests.map((test, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      placeholder="Test name"
                      value={test.name}
                      onChange={(e) => updateTest(index, 'name', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    <input
                      placeholder="Description"
                      value={test.description}
                      onChange={(e) => updateTest(index, 'description', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded focus:ring-2 focus:ring-green-500"
                    />
                    {formData.tests.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTest(index)}
                        className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addTest}
                  className="text-sm text-green-600 hover:text-green-700 transition flex items-center gap-1"
                >
                  <span>+</span> Add Test
                </button>
              </div>
            </div>

            {/* Instructions & Follow-up */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="Diet, exercise, precautions..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Follow-up Date
                </label>
                <input
                  type="date"
                  value={formData.followUpDate}
                  onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition shadow-md"
              >
                Create Prescription
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Prescriptions List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading prescriptions...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
          <div className="text-6xl mb-4">💊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Prescriptions Yet</h3>
          <p className="text-gray-600 mb-4">Create your first prescription for a patient</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + Create Prescription
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diagnosis</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Medicines</th>
                  {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {prescriptions.map((pres) => (
                  <tr 
                    key={pres._id} 
                    className="hover:bg-gray-50  transition"
                    
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {formatDate(pres)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{pres.patient?.name || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {pres.patient?._id?.slice(-6) || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                      {pres.diagnosis ? (
                        <span className="line-clamp-2">{pres.diagnosis}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not specified</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-gray-900">{getMedicineCount(pres.medicines)}</span>
                        <span className="text-gray-500">medicine{getMedicineCount(pres.medicines) !== 1 ? 's' : ''}</span>
                        {pres.medicines?.length > 0 && (
                          <span className="text-xs text-gray-400 ml-1">
                            ({pres.medicines.slice(0, 2).map(m => m.name).join(', ')}
                            {pres.medicines.length > 2 ? ` +${pres.medicines.length - 2}` : ''})
                          </span>
                        )}
                      </div>
                    </td>
                    {/* <td className="px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          viewPrescription(pres._id);
                        }}
                        className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1 transition"
                      >
                        View Detailss
                        <span>→</span>
                      </button>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Footer with count */}
          <div className="bg-gray-50 px-6 py-3 border-t">
            <p className="text-sm text-gray-500">
              Showing {prescriptions.length} of {prescriptions.length} prescriptions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrescriptionsDoc;