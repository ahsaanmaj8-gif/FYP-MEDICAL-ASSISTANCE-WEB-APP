import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Backend_Url } from './../../../utils/utils';

const SignupDoctor = () => {
  const navigate = useNavigate();

  // Basic Information
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [profilePicture, setprofilePicture] = useState(null);

  // Address Information
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  // Professional Information
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [followUpFee, setFollowUpFee] = useState('');
  const [bio, setBio] = useState('');
  const [videoConsultationAvailable, setVideoConsultationAvailable] = useState(false);

  // Qualifications
  const [qualifications, setQualifications] = useState([
    { degree: '', institute: '', year: '' }
  ]);

  // Hospital Information
  const [hospitalName, setHospitalName] = useState('');
  const [hospitalStreet, setHospitalStreet] = useState('');
  const [hospitalCity, setHospitalCity] = useState('');
  const [hospitalState, setHospitalState] = useState('');
  const [hospitalZipCode, setHospitalZipCode] = useState('');

  // Services & Certificates
  const [services, setServices] = useState(['General Consultation']);
  const [certificates, setCertificates] = useState(['']);

  // ✅ NEW: Individual Time Slots for each day
  const [selectedDays, setSelectedDays] = useState(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']);
  const [timeSlots, setTimeSlots] = useState({
    monday: [{ time: '09:00', isAvailable: true }],
    tuesday: [{ time: '09:00', isAvailable: true }],
    wednesday: [{ time: '09:00', isAvailable: true }],
    thursday: [{ time: '09:00', isAvailable: true }],
    friday: [{ time: '09:00', isAvailable: true }],
    saturday: [{ time: '09:00', isAvailable: true }],
    sunday: [{ time: '09:00', isAvailable: true }]
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // ✅ NEW: Add time slot for a specific day
  const addTimeSlot = (day) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: [...prev[day], { time: '10:00', isAvailable: true }]
    }));
  };

  // ✅ NEW: Remove time slot from a specific day
  const removeTimeSlot = (day, index) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index)
    }));
  };

  // ✅ NEW: Update time slot value
  const updateTimeSlot = (day, index, value) => {
    setTimeSlots(prev => ({
      ...prev,
      [day]: prev[day].map((slot, i) => 
        i === index ? { ...slot, time: value } : slot
      )
    }));
  };

  // Qualification Functions
  const handleQualificationChange = (index, field, value) => {
    const updatedQualifications = qualifications.map((qual, i) => 
      i === index ? { ...qual, [field]: value } : qual
    );
    setQualifications(updatedQualifications);
  };

  const addQualification = () => {
    setQualifications([...qualifications, { degree: '', institute: '', year: '' }]);
  };

  const removeQualification = (index) => {
    setQualifications(qualifications.filter((_, i) => i !== index));
  };

  // Service Functions
  const handleServiceChange = (index, value) => {
    const updatedServices = services.map((service, i) => 
      i === index ? value : service
    );
    setServices(updatedServices);
  };

  const addService = () => {
    setServices([...services, '']);
  };

  const removeService = (index) => {
    setServices(services.filter((_, i) => i !== index));
  };

  // Certificate Functions
  const handleCertificateChange = (index, value) => {
    const updatedCertificates = certificates.map((cert, i) => 
      i === index ? value : cert
    );
    setCertificates(updatedCertificates);
  };

  const addCertificate = () => {
    setCertificates([...certificates, '']);
  };

  const removeCertificate = (index) => {
    setCertificates(certificates.filter((_, i) => i !== index));
  };

  // File Upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setprofilePicture(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // ---- VALIDATIONS ----
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        setIsLoading(false);
        return;
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long");
        setIsLoading(false);
        return;
      }

      const validGenders = ["male", "female", "other"];
      if (gender && !validGenders.includes(gender)) {
        setError("Please select a valid gender");
        setIsLoading(false);
        return;
      }

      // Required fields
      const required = { name, email, password, phone, specialization, experience, licenseNumber, consultationFee };
      const missing = Object.entries(required)
        .filter(([k, v]) => !v)
        .map(([k]) => k);

      if (missing.length > 0) {
        setError(`Please fill all required fields: ${missing.join(", ")}`);
        setIsLoading(false);
        return;
      }

      // ✅ Check if selected days have at least one time slot
      const daysWithNoSlots = selectedDays.filter(day => timeSlots[day].length === 0);
      if (daysWithNoSlots.length > 0) {
        setError(`Please add at least one time slot for ${daysWithNoSlots.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // ------------ BUILD FORMDATA ------------
      const formData = new FormData();

      // 🔹 Simple fields
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("role", "doctor");
      formData.append("gender", gender || "");
      formData.append("dateOfBirth", dateOfBirth || "");

      // 🔹 Address object (stringify required)
      formData.append(
        "address",
        JSON.stringify({
          street,
          city,
          state,
          zipCode,
          country,
        })
      );

      // ✅ NEW: Format availability with individual time slots
      const availability = selectedDays.map((day) => ({
        day: day,
        slots: timeSlots[day].map(slot => ({
          startTime: slot.time,
          endTime: '', // Will be set to 30 minutes later in backend
          isAvailable: true
        }))
      }));

      // 🔹 Doctor info (stringify required)
      formData.append(
        "doctorInfo",
        JSON.stringify({
          specialization,
          qualifications: qualifications.filter((q) => q.degree && q.institute && q.year),
          experience: parseInt(experience),
          licenseNumber,
          consultationFee: parseFloat(consultationFee),
          videoConsultationAvailable: videoConsultationAvailable || false,
          followUpFee: parseFloat(followUpFee) || 0,
          bio: bio || "",
          hospital: {
            name: hospitalName || "",
            address: {
              street: hospitalStreet || "",
              city: hospitalCity || "",
              state: hospitalState || "",
              zipCode: hospitalZipCode || "",
            },
          },
          availability,
          services: services.filter((s) => s.trim() !== ""),
          certificates: certificates.filter((c) => c.trim() !== ""),
        })
      );

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      // ------------ SEND FORM DATA ------------
      const response = await axios.post(
        `${Backend_Url}/auth/register`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error("Registration error:", error);
      const msg = error.response?.data?.message || "Registration failed.";
      setError(msg);
      toast.error(msg);
    }

    setIsLoading(false);
  };

  // Helper function to format day name
  const formatDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <Link to="/role-selection" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">MediCare - Doctor Registration</span>
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Dr. John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="doctor@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0300 1234XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength="6"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password *</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Re-enter your password"
                  />
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="10001"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization *</label>
                  <input
                    type="text"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Cardiology, Dermatology, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
                  <input
                    type="number"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    required
                    min="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Number *</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    required
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="MED123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Fee (Rs.) *</label>
                  <input
                    type="number"
                    value={consultationFee}
                    onChange={(e) => setConsultationFee(e.target.value)}
                    required
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="50.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Video Consultation</label>
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="videoConsultation"
                        value="true"
                        checked={videoConsultationAvailable === true}
                        onChange={() => setVideoConsultationAvailable(true)}
                        className="h-4 w-4 text-green-600 focus:ring-green-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Available</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="videoConsultation"
                        value="false"
                        checked={videoConsultationAvailable === false}
                        onChange={() => setVideoConsultationAvailable(false)}
                        className="h-4 w-4 text-gray-600 focus:ring-gray-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">Not Available</span>
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enable this if you can conduct video consultations
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up Fee (Rs.)</label>
                  <input
                    type="number"
                    value={followUpFee}
                    onChange={(e) => setFollowUpFee(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="30.00"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Professional Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows="3"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Tell us about your professional background and expertise..."
                  />
                </div>
              </div>
            </div>

            {/* ✅ NEW: Individual Time Slots Section */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Working Days & Time Slots</h3>
              
              {/* Working Days Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Working Days *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'monday', label: 'Monday' },
                    { value: 'tuesday', label: 'Tuesday' },
                    { value: 'wednesday', label: 'Wednesday' },
                    { value: 'thursday', label: 'Thursday' },
                    { value: 'friday', label: 'Friday' },
                    { value: 'saturday', label: 'Saturday' },
                    { value: 'sunday', label: 'Sunday' }
                  ].map(day => (
                    <div key={day.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`day-${day.value}`}
                        checked={selectedDays.includes(day.value)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDays([...selectedDays, day.value]);
                          } else {
                            setSelectedDays(selectedDays.filter(d => d !== day.value));
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`day-${day.value}`} className="ml-2 text-sm text-gray-700">
                        {day.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Time Slots for Selected Days */}
              {selectedDays.length > 0 && (
                <div className="space-y-6">
                  {selectedDays.map(day => (
                    <div key={day} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-gray-800">{formatDayName(day)}</h4>
                        <button
                          type="button"
                          onClick={() => addTimeSlot(day)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                        >
                          + Add Time
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {timeSlots[day].map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="time"
                              value={slot.time}
                              onChange={(e) => updateTimeSlot(day, index, e.target.value)}
                              className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:ring-2 focus:ring-green-500"
                            />
                            {timeSlots[day].length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeTimeSlot(day, index)}
                                className="text-red-500 hover:text-red-700 text-lg"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Each time slot is 30 minutes. E.g., 09:00 = 9:00 AM, 14:00 = 2:00 PM
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {selectedDays.length === 0 && (
                <p className="text-red-500 text-sm">Please select at least one working day</p>
              )}
            </div>

            {/* Hospital Information */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hospital / Practice Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Name</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="City General Hospital"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital Street</label>
                  <input
                    type="text"
                    value={hospitalStreet}
                    onChange={(e) => setHospitalStreet(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Hospital Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital City</label>
                  <input
                    type="text"
                    value={hospitalCity}
                    onChange={(e) => setHospitalCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Hospital City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital State</label>
                  <input
                    type="text"
                    value={hospitalState}
                    onChange={(e) => setHospitalState(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Hospital State"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hospital ZIP Code</label>
                  <input
                    type="text"
                    value={hospitalZipCode}
                    onChange={(e) => setHospitalZipCode(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Hospital ZIP Code"
                  />
                </div>
              </div>
            </div>

            {/* Qualifications */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Qualifications</h3>
              {qualifications.map((qual, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 border rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                    <input
                      type="text"
                      value={qual.degree}
                      onChange={(e) => handleQualificationChange(index, 'degree', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="MBBS, MD, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institute</label>
                    <input
                      type="text"
                      value={qual.institute}
                      onChange={(e) => handleQualificationChange(index, 'institute', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="University Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <input
                      type="number"
                      value={qual.year}
                      onChange={(e) => handleQualificationChange(index, 'year', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                      placeholder="2020"
                      min="1900"
                      max="2030"
                    />
                  </div>
                  <div className="flex items-end">
                    {qualifications.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeQualification(index)}
                        className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addQualification}
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Qualification
              </button>
            </div>

            {/* Services */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Services Offered</h3>
              {services.map((service, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={service}
                    onChange={(e) => handleServiceChange(index, e.target.value)}
                    placeholder="Enter service"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  {services.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeService(index)} 
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addService} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Service
              </button>
            </div>

            {/* Certificates */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Certificates (URLs)</h3>
              {certificates.map((certificate, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    value={certificate}
                    onChange={(e) => handleCertificateChange(index, e.target.value)}
                    placeholder="Certificate URL"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                  />
                  {certificates.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeCertificate(index)} 
                      className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button 
                type="button" 
                onClick={addCertificate} 
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
              >
                Add Certificate
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 disabled:opacity-50 transition duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting for Verification...
                </>
              ) : (
                'Submit for Verification'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupDoctor;