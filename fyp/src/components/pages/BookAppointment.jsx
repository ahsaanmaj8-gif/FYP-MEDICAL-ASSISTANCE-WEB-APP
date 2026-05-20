import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import { Backend_Url } from './../../../utils/utils';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();

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

      // 1. Initiate JazzCash payment
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
        // 2. Book appointment after payment
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

  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Get date 30 days from now for max date
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <div className={`flex items-center ${bookingStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    bookingStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Select Slot</span>
                </div>
                <div className={`flex-1 h-1 mx-4 ${
                  bookingStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'
                }`}></div>
                <div className={`flex items-center ${bookingStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    bookingStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
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
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold mb-6">Select Appointment Date & Time</h2>
                
                {/* Date Selection */}
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    min={minDate}
                    max={maxDateStr}
                    className="w-full md:w-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Time Slots */}
                {selectedDate && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">
                        Available Slots for {getDayName(selectedDate)}
                      </h3>
                      {doctor && (
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Consultation Fee</p>
                          <p className="text-2xl font-bold text-blue-600">Rs.{doctor.consultationFee}</p>
                        </div>
                      )}
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <div className="inline-block animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></div>
                        <p className="mt-2 text-gray-600">Loading slots...</p>
                      </div>
                    ) : slots.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <div className="text-4xl mb-2">📅</div>
                        <h3 className="text-lg font-semibold mb-2">No Slots Available</h3>
                        <p className="text-gray-600">Please select another date</p>
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
                                ? 'bg-gray-100 border-gray-200 cursor-not-allowed opacity-60 relative' 
                                : selectedSlot?.startTime === slot.startTime
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-white border-gray-200 hover:border-blue-400 hover:bg-blue-50'
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
                                ? 'text-gray-500' 
                                : selectedSlot?.startTime === slot.startTime
                                  ? 'text-white'
                                  : 'text-gray-800'
                            }`}>
                              {formatTime(slot.startTime)}
                            </div>
                            {/* <div className={`text-xs mt-1 ${
                              slot.isBooked 
                                ? 'text-gray-400 line-through' 
                                : selectedSlot?.startTime === slot.startTime
                                  ? 'text-blue-100'
                                  : 'text-gray-500'
                            }`}>
                              {slot.isBooked ? 'Booked' : `${formatTime(slot.endTime)}`}
                            </div> */}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Consultation Type */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Consultation Type</h3>
                <div className="space-y-3">
                  <label className="flex items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="appointmentType"
                      value="in-person"
                      checked={appointmentType === 'in-person'}
                      onChange={(e) => setAppointmentType(e.target.value)}
                      className="h-5 w-5 text-blue-600"
                    />
                    <div className="ml-3">
                      <span className="font-medium">In-Person Consultation</span>
                      <p className="text-sm text-gray-500">Visit doctor at clinic/hospital</p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center p-4 border rounded-lg ${
                    doctor?.videoConsultationAvailable 
                      ? 'cursor-pointer hover:bg-gray-50' 
                      : 'bg-gray-50 cursor-not-allowed opacity-60'
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
                      <span className="font-medium">Video Consultation</span>
                      <p className="text-sm text-gray-500">
                        {doctor?.videoConsultationAvailable 
                          ? 'Consult from home via video call' 
                          : 'Video consultation not available'}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Symptoms & Description */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4">Symptoms & Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Symptoms (comma separated)
                    </label>
                    <input
                      type="text"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      placeholder="e.g., fever, cough, headache"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Describe your condition in detail..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Continue Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleContinue}
                  disabled={!selectedSlot}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue to Payment
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Step 2: Payment with JazzCash */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                  <div className="text-6xl mb-4">💳</div>
                  <h2 className="text-2xl font-bold mb-2">Complete Your Payment</h2>
                  <p className="text-gray-600">Pay securely with JazzCash</p>
                </div>

                {/* Booking Summary */}
                <div className="bg-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-lg mb-4">Booking Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium">{doctor?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{formatTime(selectedSlot?.startTime)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium capitalize">{appointmentType.replace('-', ' ')}</span>
                    </div>
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-blue-600">Rs.{doctor?.consultationFee}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* JazzCash Payment Form */}
                <div className="border-2 border-dashed border-green-300 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <img 
                      src="https://crystalpng.com/wp-content/uploads/2024/12/new-Jazzcash-logo-768x768.png" 
                      alt="JazzCash"
                      className="h-12"
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        <span className="font-bold">Merchant ID:</span> MC604531
                      </p>
                      <p className="text-sm text-green-800 mt-1">
                        <span className="font-bold">Amount:</span> PKR {doctor?.consultationFee * 280}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <input
                        type="text"
                        placeholder="Mobile Number"
                        defaultValue="03001234567"
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        readOnly
                      />
                      <input
                        type="password"
                        placeholder="JazzCash PIN"
                        defaultValue="1234"
                        className="px-4 py-3 border border-gray-300 rounded-lg"
                        readOnly
                      />
                    </div>

                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800">
                      ⚡ Demo Mode: No actual amount will be deducted
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setBookingStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={processing}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
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

                <p className="text-xs text-center text-gray-500 mt-4">
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