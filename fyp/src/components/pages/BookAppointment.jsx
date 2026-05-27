import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { ThemeContext } from '../../context/ThemeContext';
import { Backend_Url } from './../../../utils/utils';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointmentType, setAppointmentType] = useState('in-person');
  const [symptoms, setSymptoms] = useState('');
  const [description, setDescription] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailability();
    }
  }, [selectedDate]);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to book appointment');
      navigate('/login', { state: { from: `/book-appointment/${doctorId}` } });
      return;
    }
  };

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${Backend_Url}/appointments/availability/${doctorId}`,
        { params: { date: selectedDate } }
      );

      if (response.data.success) {
        setDoctor(response.data.data.doctor);
        setSlots(response.data.data.slots);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      toast.error('Failed to load availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    if (slot.isBooked) {
      toast.error('This time slot is already booked');
      return;
    }
    setSelectedSlot(slot);
  };

  const handleContinue = () => {
    if (!selectedSlot) {
      toast.error('Please select a time slot');
      return;
    }
    setBookingStep(2);
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const token = localStorage.getItem('token');

      const paymentResponse = await axios.post(
        `${Backend_Url}/appointments/payment/jazzcash/initiate`,
        {
          amount: doctor.consultationFee,
          orderId: `APT_${Date.now()}`,
          description: `Appointment with Dr. ${doctor.name}`
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (paymentResponse.data.success) {
        const appointmentResponse = await axios.post(
          `${Backend_Url}/appointments/book`,
          {
            doctorId,
            appointmentDate: selectedDate,
            appointmentTime: selectedSlot.startTime,
            appointmentType,
            symptoms,
            description
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (appointmentResponse.data.success) {
          toast.success('Appointment booked successfully! 🎉');
          navigate('/patient/appointments');
        }
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    } finally {
      setProcessing(false);
    }
  };

  const getDayName = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  // Dynamic classes based on theme
  const bgColor = theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50';
  const cardBg = theme === 'dark' ? 'bg-gray-800' : 'bg-white';
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900';
  const subTextColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const borderColor = theme === 'dark' ? 'border-gray-700' : 'border-gray-300';
  const inputBg = theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-white text-gray-900 border-gray-300';
  const labelColor = theme === 'dark' ? 'text-gray-300' : 'text-gray-700';
  const slotBg = theme === 'dark' ? 'bg-gray-700 hover:bg-blue-900' : 'bg-white hover:bg-blue-50';
  const slotSelectedBg = 'bg-blue-600 border-blue-600 text-white';
  const slotBookedBg = theme === 'dark' ? 'bg-gray-600 border-gray-500 opacity-50' : 'bg-gray-100 border-gray-200 opacity-60';
  const progressBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  const progressActiveBg = 'bg-blue-600';
  const stepCircleActive = 'bg-blue-600 text-white';
  const stepCircleInactive = theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600';
  const stepTextActive = theme === 'dark' ? 'text-blue-400' : 'text-blue-600';
  const stepTextInactive = theme === 'dark' ? 'text-gray-500' : 'text-gray-400';
  const summaryBg = theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-50';
  const demoBoxBorder = theme === 'dark' ? 'border-green-700' : 'border-green-300';
  const demoBoxBg = theme === 'dark' ? 'bg-green-900/20' : 'bg-green-50';
  const demoTextColor = theme === 'dark' ? 'text-green-300' : 'text-green-800';
  const warningBg = theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-50';
  const warningText = theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800';

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 30 days from now for max date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className={`min-h-screen ${bgColor} transition-colors duration-300`}>
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <div className={`flex items-center ${bookingStep >= 1 ? stepTextActive : stepTextInactive}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    bookingStep >= 1 ? stepCircleActive : stepCircleInactive
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Select Slot</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${
                  bookingStep >= 2 ? progressActiveBg : progressBg
                }`}></div>
                <div className={`flex items-center ${bookingStep >= 2 ? stepTextActive : stepTextInactive}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    bookingStep >= 2 ? stepCircleActive : stepCircleInactive
                  }`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Payment</span>
                </div>
              </div>
            </div>
          </div>

          {bookingStep === 1 ? (
            <>
              {/* Step 1: Select Date & Time */}
              <div className={`rounded-2xl shadow-lg p-6 mb-6 ${cardBg}`}>
                <h2 className={`text-2xl font-bold mb-6 ${textColor}`}>Select Appointment Date & Time</h2>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={minDate}
                    max={maxDateStr}
                    className={`w-full md:w-64 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${inputBg} ${borderColor}`}
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className={`text-lg font-semibold ${textColor}`}>
                        Available Slots for {getDayName(selectedDate)}
                      </h3>
                      {doctor && (
                        <div className="text-right">
                          <p className={`text-sm ${subTextColor}`}>Consultation Fee</p>
                          <p className="text-2xl font-bold text-blue-600">Rs.{doctor.consultationFee}</p>
                        </div>
                      )}
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className={`mt-2 ${subTextColor}`}>Loading slots...</p>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className={`text-center py-8 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}>
                        <div className="text-4xl mb-2">📅</div>
                        <h3 className={`text-lg font-semibold mb-2 ${textColor}`}>No Slots Available</h3>
                        <p className={subTextColor}>Please select another date</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {slots.map((slot, index) => (
                          <button
                            key={index}
                            onClick={() => handleSlotSelect(slot)}
                            disabled={slot.isBooked}
                            className={`
                              p-3 rounded-lg border-2 text-center transition-all
                              ${slot.isBooked 
                                ? slotBookedBg
                                : selectedSlot?.startTime === slot.startTime
                                  ? slotSelectedBg
                                  : `${slotBg} ${borderColor} hover:border-blue-400`
                              }
                            `}
                          >
                            {slot.isBooked && (
                              <div className="absolute top-1 right-1 text-red-500 text-xs">
                                ⚡
                              </div>
                            )}
                            <div className={`font-bold ${
                              slot.isBooked 
                                ? 'text-gray-500 dark:text-gray-400' 
                                : selectedSlot?.startTime === slot.startTime
                                  ? 'text-white'
                                  : textColor
                            }`}>
                              {formatTime(slot.startTime)}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Consultation Type */}
              <div className={`rounded-2xl shadow-lg p-6 mb-6 ${cardBg}`}>
                <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Consultation Type</h3>
                <div className="space-y-3">
                  <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${cardBg} ${borderColor} hover:bg-opacity-50 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value="in-person"
                      checked={appointmentType === 'in-person'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="h-5 w-5 text-blue-600"
                    />
                    <div className="ml-3">
                      <span className={`font-medium ${textColor}`}>In-Person Consultation</span>
                      <p className={`text-sm ${subTextColor}`}>Visit doctor at clinic/hospital</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-lg ${
                    doctor?.videoConsultationAvailable 
                      ? `cursor-pointer ${cardBg} ${borderColor} ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`
                      : `${theme === 'dark' ? 'bg-gray-700 opacity-60' : 'bg-gray-50 opacity-60'} cursor-not-allowed`
                  }`}>
                    <input
                      type="radio"
                      name="appointmentType"
                      value="video-consultation"
                      checked={appointmentType === 'video-consultation'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      disabled={!doctor?.videoConsultationAvailable}
                      className="h-5 w-5 text-blue-600"
                    />
                    <div className="ml-3">
                      <span className={`font-medium ${textColor}`}>Video Consultation</span>
                      <p className={`text-sm ${subTextColor}`}>
                        {doctor?.videoConsultationAvailable 
                          ? 'Consult from home via video call' 
                          : 'Video consultation not available'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Symptoms & Description */}
              <div className={`rounded-2xl shadow-lg p-6 mb-6 ${cardBg}`}>
                <h3 className={`text-lg font-semibold mb-4 ${textColor}`}>Symptoms & Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                      Symptoms (comma separated)
                    </label>
                    <input
                      type="text"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., fever, cough, headache"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg} ${borderColor}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${labelColor}`}>
                      Additional Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Describe your condition in detail..."
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${inputBg} ${borderColor}`}
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleContinue}
                  disabled={!selectedSlot}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Continue to Payment
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Payment with JazzCash */}
              <div className={`rounded-2xl shadow-lg p-8 ${cardBg}`}>
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💳</div>
                  <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>Complete Your Payment</h2>
                  <p className={subTextColor}>Pay securely with JazzCash</p>
                </div>

                {/* Booking Summary */}
                <div className={`rounded-xl p-6 mb-8 ${summaryBg}`}>
                  <h3 className={`font-semibold text-lg mb-4 ${textColor}`}>Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={subTextColor}>Doctor:</span>
                      <span className={`font-medium ${textColor}`}>{doctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={subTextColor}>Date:</span>
                      <span className={`font-medium ${textColor}`}>{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={subTextColor}>Time:</span>
                      <span className={`font-medium ${textColor}`}>{formatTime(selectedSlot?.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={subTextColor}>Type:</span>
                      <span className={`font-medium ${textColor} capitalize`}>{appointmentType.replace('-', ' ')}</span>
                    </div>
                    <div className={`border-t pt-3 mt-3 ${borderColor}`}>
                      <div className="flex justify-between">
                        <span className={`font-semibold ${textColor}`}>Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">Rs.{doctor?.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JazzCash Payment Form */}
                <div className={`border-2 border-dashed rounded-xl p-6 mb-6 ${demoBoxBorder}`}>
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo-768x768.png" 
                      alt="JazzCash"
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${demoBoxBg}`}>
                      <p className={`text-sm ${demoTextColor}`}>
                        <span className="font-bold">Merchant ID:</span> MC604531
                      </p>
                      <p className={`text-sm ${demoTextColor} mt-1`}>
                        <span className="font-bold">Amount:</span> PKR {doctor?.consultationFee * 280}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        defaultValue="03001234567"
                        className={`px-4 py-3 border rounded-lg ${inputBg} ${borderColor}`}
                        readOnly
                      />
                      <input
                        type="password"
                        placeholder="JazzCash PIN"
                        defaultValue="1234"
                        className={`px-4 py-3 border rounded-lg ${inputBg} ${borderColor}`}
                        readOnly
                      />
                    </div>

                    <div className={`p-3 rounded-lg text-sm ${warningBg} ${warningText}`}>
                      ⚡ Demo Mode: No actual amount will be deducted
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setBookingStep(1)}
                    className={`flex-1 border-2 px-6 py-3 rounded-lg font-semibold transition ${borderColor} ${textColor} hover:bg-opacity-10 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {processing ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Pay with JazzCash'
                    )}
                  </button>
                </div>

                <p className={`text-xs text-center mt-4 ${subTextColor}`}>
                  This is a demo integration. No actual payment will be processed.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookAppointment;