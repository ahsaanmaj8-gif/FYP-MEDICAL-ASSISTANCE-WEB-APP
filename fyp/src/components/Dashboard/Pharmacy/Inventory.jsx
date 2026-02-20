import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brand: '',
    type: 'tablet',
    strength: '',
    category: '',
    price: '',
    stock: '',
    prescriptionRequired: false
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/pharmacy/medicines', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMedicines(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8085/api/v1/pharmacy/medicines', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMedicines([response.data.data, ...medicines]);
        setFormData({
          name: '',
          genericName: '',
          brand: '',
          type: 'tablet',
          strength: '',
          category: '',
          price: '',
          stock: '',
          prescriptionRequired: false
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding medicine:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this medicine?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:8085/api/v1/pharmacy/medicines/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setMedicines(medicines.filter(m => m._id !== id));
      }
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const medicineTypes = ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">📦 Medicine Inventory</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          + Add Medicine
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl p-6 shadow-lg border">
          <h2 className="text-xl font-bold mb-4">Add New Medicine</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Medicine Name*"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Generic Name"
                value={formData.genericName}
                onChange={(e) => setFormData({...formData, genericName: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Brand"
                value={formData.brand}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                className="border rounded-lg p-2"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="border rounded-lg p-2"
              >
                {medicineTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Strength (e.g., 500mg)"
                value={formData.strength}
                onChange={(e) => setFormData({...formData, strength: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="border rounded-lg p-2"
              />
              <input
                type="number"
                placeholder="Price*"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="border rounded-lg p-2"
                required
              />
              <input
                type="number"
                placeholder="Stock*"
                value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                className="border rounded-lg p-2"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.prescriptionRequired}
                onChange={(e) => setFormData({...formData, prescriptionRequired: e.target.checked})}
                className="mr-2"
              />
              <label>Prescription Required</label>
            </div>
            <div className="flex space-x-2">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Add Medicine
              </button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading medicines...</div>
      ) : medicines.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          No medicines added yet. Click "Add Medicine" to get started.
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left">Medicine</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Stock</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map(medicine => (
                <tr key={medicine._id} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    <div>
                      <div className="font-bold">{medicine.name}</div>
                      <div className="text-sm text-gray-600">{medicine.genericName || medicine.brand}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {medicine.type}
                    </span>
                  </td>
                  <td className="p-4 font-bold">${medicine.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-sm ${
                      medicine.stock < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {medicine.stock}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(medicine._id)}
                      className="bg-red-100 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Inventory;