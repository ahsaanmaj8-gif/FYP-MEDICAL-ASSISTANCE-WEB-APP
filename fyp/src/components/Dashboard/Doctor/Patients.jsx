import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/doctor/patients', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        setPatients(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  const handlePatientClick = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(search.toLowerCase()) ||
    patient.email?.toLowerCase().includes(search.toLowerCase()) ||
    patient.phone?.includes(search)
  );

  const getBloodGroupColor = (bloodGroup) => {
    const colors = {
      'A+': 'bg-red-100 text-red-800',
      'A-': 'bg-red-50 text-red-700',
      'B+': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-50 text-blue-700',
      'AB+': 'bg-purple-100 text-purple-800',
      'AB-': 'bg-purple-50 text-purple-700',
      'O+': 'bg-green-100 text-green-800',
      'O-': 'bg-green-50 text-green-700'
    };
    return colors[bloodGroup] || 'bg-gray-100 text-gray-800';
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium">
          Total: {patients.length} patients
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search by name, email or phone number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
      </div>

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {search ? 'No patients found' : 'No patients yet'}
          </h3>
          <p className="text-gray-600">
            {search 
              ? 'Try adjusting your search terms' 
              : 'You haven\'t had any appointments yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-lg transition-all  hover:border-green-300 "
            >
              <div className="flex items-center space-x-4">
                {/* Patient Avatar */}
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {patient.name?.charAt(0).toUpperCase() || 'P'}
                </div>
                
                {/* Patient Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-lg">{patient.name}</h3>
                  <p className="text-gray-600 text-sm flex items-center mt-1">
                    <span className="mr-1">📧</span> {patient.email}
                  </p>
                  <p className="text-gray-500 text-sm flex items-center mt-1">
                    <span className="mr-1">📞</span> {patient.phone || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Patient Stats */}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Visits</div>
                  <div className="font-bold text-gray-900">{patient.appointmentCount || 0}</div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Blood</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${getBloodGroupColor(patient.bloodGroup)}`}>
                    {patient.bloodGroup || 'N/A'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium text-gray-700 capitalize">
                    {patient.gender || 'N/A'}
                  </div>
                </div>
              </div>

              {patient.lastVisit && (
                <div className="mt-3 text-xs text-gray-500 flex items-center justify-end">
                  <span className="mr-1">🕒</span>
                  Last visit: {new Date(patient.lastVisit).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </div>
              )}

              {/* View Details Indicator */}
              {/* <div className="mt-3 text-xs text-green-600 flex items-center justify-end">
                <span>Click to view details</span>
                <span className="ml-1">→</span>
              </div> */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Patients;