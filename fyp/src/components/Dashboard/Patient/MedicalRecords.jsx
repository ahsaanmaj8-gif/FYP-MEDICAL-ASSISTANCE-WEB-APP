import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MedicalRecords = () => {
  const [records, setRecords] = useState({
    prescriptions: [],
    labReports: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMedicalRecords();
  }, []);

  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch prescriptions
      const presRes = await axios.get('http://localhost:8085/api/v1/patient/prescriptions', {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Fetch lab tests with reports
      const labRes = await axios.get('http://localhost:8085/api/v1/patient/lab-tests', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setRecords({
        prescriptions: presRes.data.data || [],
        labReports: labRes.data.data?.filter(t => t.reportUrl) || [],
        
      });


      console.log(labRes.data.data);
      
    } catch (error) {
      console.error('Error fetching medical records:', error);
      toast.error('Failed to load medical records');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-red-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Prescriptions Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">💊</span> Recent Prescriptions
          </h2>
          
          {records.prescriptions.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No prescriptions yet</p>
          ) : (
            <div className="space-y-4">
              {records.prescriptions.slice(0, 5).map((pres) => (
                <div key={pres._id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{pres.doctor?.user?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{pres.medicines?.length} medicines</p>
                    </div>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      Prescription
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lab Reports Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <span className="mr-2">🔬</span> Lab Reports
          </h2>
          
          {records.labReports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No lab reports yet</p>
          ) : (
            <div className="space-y-4">
              {records.labReports.slice(0, 5).map((report) => (
                <div key={report._id} className="border-b pb-3 last:border-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{report.testName}</p>
                      <p className="text-sm text-gray-600">{report.laboratory?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(report.createdAt)}</p>
                    </div>
                    <a
                      href={report.reportUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 hover:text-teal-700 text-sm"
                    >
                      View →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Health Summary */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-2">🏥 Health Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="text-2xl font-bold">{records.prescriptions.length}</div>
            <div className="text-green-100 text-sm">Total Prescriptions</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{records.labReports.length}</div>
            <div className="text-green-100 text-sm">Lab Reports</div>
          </div>
          <div>
            <div className="text-2xl font-bold">
              {records.prescriptions.reduce((acc, p) => acc + (p.medicines?.length || 0), 0)}
            </div>
            <div className="text-green-100 text-sm">Medicines Prescribed</div>
          </div>
        
        </div>
      </div>
    </div>
  );
};

export default MedicalRecords;