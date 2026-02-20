import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const SignupPatient = () => {
  const navigate = useNavigate();

  // Separate States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [bloodGroup, setBloodGroup] = useState('');
  const [allergies, setAllergies] = useState(['']);
  const [medicalHistory, setMedicalHistory] = useState(['']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle Address
  const handleAddressChange = (field, value) => {
    setAddress(prev => ({ ...prev, [field]: value }));
  };

  // Handle arrays - FIXED: Correct function name
  const handleArrayChange = (setter, index, value) => {
    setter(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const addArrayField = setter => setter(prev => [...prev, '']);
  const removeArrayField = (setter, index) =>
    setter(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (!name || !email || !password || !phone) {
      setError('Please fill all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append("name", name);
      data.append("email", email);
      data.append("password", password);
      data.append("phone", phone);
      data.append("role", "user");
      data.append("dateOfBirth", dateOfBirth || "");
      data.append("gender", gender || "");
      
      if (profilePicture) {
        data.append("profilePicture", profilePicture);
      }

      data.append("address", JSON.stringify(address));
      data.append("bloodGroup", bloodGroup);
      data.append("allergies", JSON.stringify(allergies.filter(a => a.trim() !== "")));
      data.append("medicalHistory", JSON.stringify(medicalHistory.filter(h => h.trim() !== "")));

      const response = await axios.post("http://localhost:8085/api/v1/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      setError(msg);
      toast.error(msg);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <Link to="/role-selection" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MediCare - Patient Registration</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* BASIC INFORMATION */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Full Name *" 
                  className="w-full border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="Email *" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)} 
                  placeholder="Phone *" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="date" 
                  value={dateOfBirth} 
                  onChange={e => setDateOfBirth(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select 
                  value={gender} 
                  onChange={e => setGender(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select 
                  value={bloodGroup} 
                  onChange={e => setBloodGroup(e.target.value)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Blood Group</option>
                  {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map(bg => (
                    <option key={bg} value={bg}>{bg}</option>
                  ))}
                </select>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture</label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={e => setProfilePicture(e.target.files[0])}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="Password *" 
                  minLength={6} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  placeholder="Confirm Password *" 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ADDRESS */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={address.street}
                  onChange={(e) => handleAddressChange("street", e.target.value)}
                  placeholder="Street"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  placeholder="City"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  placeholder="State"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={address.zipCode}
                  onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                  placeholder="ZIP Code"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => handleAddressChange("country", e.target.value)}
                    placeholder="Country"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* ALLERGIES */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allergies</h3>
              {allergies.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input 
                    value={item} 
                    onChange={e => handleArrayChange(setAllergies, index, e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    placeholder="Enter allergy"
                  />
                  {allergies.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeArrayField(setAllergies, index)} 
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addArrayField(setAllergies)} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Add Allergy
              </button>
            </div>

            {/* MEDICAL HISTORY */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
              {medicalHistory.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input 
                    value={item} 
                    onChange={e => handleArrayChange(setMedicalHistory, index, e.target.value)} 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                    placeholder="Enter medical condition"
                  />
                  {medicalHistory.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeArrayField(setMedicalHistory, index)} 
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={() => addArrayField(setMedicalHistory)} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              >
                Add Medical History
              </button>
            </div>

            {/* SUBMIT */}
            <button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? 'Creating Account...' : 'Create Patient Account'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPatient;