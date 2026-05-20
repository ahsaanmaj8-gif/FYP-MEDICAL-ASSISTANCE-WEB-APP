import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../../utils/utils';

const Tests = () => {
  const [tests, setTests] = useState([]);
  const [registrationTests, setRegistrationTests] = useState([]);
  const [addedTests, setAddedTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newTest, setNewTest] = useState({
    name: '',
    category: '',
    price: '',
    duration: '24 hours',
    description: ''
  });

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${Backend_Url}/lab/tests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const allTests = response.data.data;
        setTests(allTests);
        
        // Separate registration tests and added tests
        const regTests = allTests.filter(test => test.source === 'registration');
        const added = allTests.filter(test => test.source !== 'registration');
        
        setRegistrationTests(regTests);
        setAddedTests(added);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
      toast.error('Failed to load tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${Backend_Url}/lab/tests`, newTest, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success('Test added successfully');
        fetchTests(); // Refresh the list
        setShowForm(false);
        setNewTest({ name: '', category: '', price: '', duration: '24 hours', description: '' });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add test');
    }
  };

  const toggleTestStatus = async (testId, isActive) => {
    try {
      const token = localStorage.getItem('token');
      
      // Check if it's a registration test (can't edit)
      if (testId.startsWith('reg-')) {
        toast.error('Registration tests cannot be modified. Add new tests instead.');
        return;
      }
      
      await axios.put(`${Backend_Url}/lab/tests/${testId}/status`, 
        { isActive: !isActive },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success(`Test ${!isActive ? 'activated' : 'deactivated'}`);
      fetchTests();
    } catch (error) {
      toast.error('Failed to update status');
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
        <div>
          <h1 className="text-3xl font-bold">🧪 Test Management</h1>
          <p className="text-gray-600 mt-1">
            {tests.length} total tests ({registrationTests.length} from registration, {addedTests.length} added)
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : '+ Add New Test'}
        </button>
      </div>

      {/* Add Test Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <h2 className="text-lg font-bold mb-4">Add New Test</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Test Name *"
                value={newTest.name}
                onChange={(e) => setNewTest({...newTest, name: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="text"
                placeholder="Category *"
                value={newTest.category}
                onChange={(e) => setNewTest({...newTest, category: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <input
                type="number"
                placeholder="Price (Rs.) *"
                value={newTest.price}
                onChange={(e) => setNewTest({...newTest, price: e.target.value})}
                className="border p-2 rounded w-full"
                required
              />
              <select
                value={newTest.duration}
                onChange={(e) => setNewTest({...newTest, duration: e.target.value})}
                className="border p-2 rounded w-full"
              >
                <option value="24 hours">24 hours</option>
                <option value="48 hours">48 hours</option>
                <option value="72 hours">72 hours</option>
                <option value="1 week">1 week</option>
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={newTest.description}
              onChange={(e) => setNewTest({...newTest, description: e.target.value})}
              rows="2"
              className="border p-2 rounded w-full"
            />
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Save Test
            </button>
          </form>
        </div>
      )}

      {/* Registration Tests (Read-only) */}
      {registrationTests.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            📝 Tests from Registration
            <span className="text-sm text-gray-500 font-normal ml-2">(Cannot be modified)</span>
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {registrationTests.map((test) => (
              <div key={test._id} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center">
                      <span className="text-xl text-gray-600">📋</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{test.name}</h3>
                      <p className="text-gray-600 text-sm">{test.category}</p>
                      <p className="text-sm text-gray-500">{test.description}</p>
                      <div className="flex space-x-4 mt-1">
                        <span className="font-semibold">Rs.{test.price}</span>
                        <span className="text-gray-500">{test.duration}</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Registration
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Added Tests (Editable) */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          🧪 Added Tests
          <span className="text-sm text-gray-500 font-normal ml-2">(Can be modified)</span>
        </h2>
        {addedTests.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed">
            <div className="text-4xl mb-3">🧪</div>
            <p className="text-gray-600">No added tests yet. Click "Add New Test" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {addedTests.map((test) => (
              <div key={test._id} className="bg-white p-4 rounded-xl shadow-md border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-xl text-blue-600">🧪</span>
                    </div>
                    <div>
                      <h3 className="font-bold">{test.name}</h3>
                      <p className="text-gray-600 text-sm">{test.category}</p>
                      <p className="text-sm text-gray-500">{test.description}</p>
                      <div className="flex space-x-4 mt-1">
                        <span className="font-semibold">{test.price}</span>
                        <span className="text-gray-500">{test.duration}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm ${test.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {test.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={() => toggleTestStatus(test._id, test.isActive)}
                      className={`px-4 py-2 rounded ${test.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      {test.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Tests;