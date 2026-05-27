import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';
import Header from '../Homepage/Header';
import Footer from '../Homepage/Footer';
import toast from 'react-hot-toast';
import ReviewModal from '../Reviews/ReviewModal';
import StarRating from '../Reviews/StarRating';
import ReviewsList from '../Reviews/ReviewsList';
import { Backend_Url } from './../../../utils/utils';

const DoctorProfilePage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [ratingStats, setRatingStats] = useState({
    average: 0,
    total: 0
  });

  useEffect(() => {
    fetchDoctorProfile();
  }, [doctorId]);

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${Backend_Url}/public/doctors/${doctorId}`);
      
      if (response.data.success) {
        const doctorData = response.data.data;
        setDoctor(doctorData);
        
        // ✅ FIX: Update ratingStats from doctor data
        setRatingStats({
          average: doctorData.rating?.average || 0,
          total: doctorData.rating?.count || 0
        });
        
        console.log('Doctor rating:', doctorData.rating); // Debug log
      } else {
        toast.error('Doctor not found');
        navigate('/doctors');
      }
    } catch (error) {
      console.error('Error fetching doctor:', error);
      toast.error('Failed to load doctor profile');
      navigate('/doctors');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD THIS: Fetch reviews separately to get updated stats
  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${Backend_Url}/reviews/doctor/${doctorId}`);
      if (response.data.success) {
        setRatingStats({
          average: parseFloat(response.data.data.average) || 0,
          total: response.data.data.total || 0
        });
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: `/book-appointment/${doctorId}` } });
      return;
    }
    navigate(`/book-appointment/${doctorId}`);
  };

  const handleReviewSubmitted = (data) => {
    console.log('Review submitted:', data); // Debug log
    // Update with the returned data
    setRatingStats({
      average: data.averageRating,
      total: data.totalReviews
    });
    // Also fetch reviews again to be sure
    fetchReviews();
  };

  const formatDay = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor Not Found</h2>
          <button
            onClick={() => navigate('/doctors')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Doctors
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <span className="mr-2">←</span> Back
        </button>

        {/* Doctor Profile Card */}
        <div className={`rounded-2xl shadow-xl overflow-hidden ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                {doctor.profilePicture ? (
                  <img 
                    src={doctor.profilePicture} 
                    alt={doctor.name}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-5xl text-blue-600">👨‍⚕️</span>
                )}
              </div>
              
              {/* Basic Info */}
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{doctor.name}</h1>
                <p className="text-xl text-blue-100 mb-3">{doctor.specialization}</p>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  {/* Rating with Stars - NOW FIXED */}
                  {/* <span className="bg-white/20 px-4 py-2 rounded-full text-sm flex items-center gap-2">
                    <StarRating initialRating={ratingStats.average} readOnly size="sm" />
                    <span>
                      ({ratingStats.total} {ratingStats.total === 1 ? 'review' : 'reviews'})
                    </span> */}
                  {/* </span> */}
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    💼 {doctor.experience} years experience
                  </span>
                  <span className="bg-white/20 px-4 py-2 rounded-full text-sm">
                    💰 {doctor.consultationFee} consultation
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b px-8">
            <nav className="flex space-x-8">
              {['about', 'qualifications', 'availability', 'reviews'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About Dr. {doctor.name}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                    {doctor.bio || 'No bio provided.'}
                  </p>
                </div>

                {/* Services */}
                {doctor.services?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                    <div className="flex flex-wrap gap-2">
                      {doctor.services.map((service, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hospital Info */}
                {doctor.hospital?.name && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Practice Location</h3>
                    <div className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="font-semibold">{doctor.hospital.name}</p>
                      <p className="text-sm mt-1">
                        {doctor.hospital.address?.street && `${doctor.hospital.address.street}, `}
                        {doctor.hospital.address?.city && `${doctor.hospital.address.city}, `}
                        {doctor.hospital.address?.state}
                      </p>
                    </div>
                  </div>
                )}

                {/* Consultation Type */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Consultation Type</h3>
                  <div className="flex flex-wrap gap-3">
                    {doctor.videoConsultationAvailable && (
                      <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg flex items-center">
                        <span className="mr-2">🎥</span> Video Consultation Available
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg flex items-center">
                      <span className="mr-2">🏥</span> In-Person Consultation
                    </span>
                  </div>
                </div>

                {/* Fees */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Consultation Fees</h3>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500">First Visit</p>
                      <p className="text-xl font-bold">Rs.{doctor.consultationFee}</p>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="text-sm text-gray-500">Follow-up</p>
                      <p className="text-xl font-bold">Rs.{doctor.followUpFee || doctor.consultationFee}</p>
                    </div>
                  </div>
                </div>

                {/* Rate Doctor Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-lg flex items-center gap-2"
                  >
                    <span>⭐</span>
                    Rate this Doctor
                  </button>
                </div>
              </div>
            )}

            {/* Qualifications Tab */}
            {activeTab === 'qualifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-3">Education & Qualifications</h3>
                {doctor.qualifications?.length > 0 ? (
                  <div className="space-y-4">
                    {doctor.qualifications.map((qual, index) => (
                      <div key={index} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <p className="font-semibold">{qual.degree}</p>
                        <p className="text-sm mt-1">{qual.institute}</p>
                        <p className="text-xs text-gray-500 mt-1">Year: {qual.year}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No qualification details available.</p>
                )}

                {/* License Number */}
                <div className="mt-6">
                  <p className="text-sm text-gray-500">License Number</p>
                  <p className="font-mono">{doctor.licenseNumber}</p>
                </div>

                {/* Rate Doctor Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-lg flex items-center gap-2"
                  >
                    <span>⭐</span>
                    Rate this Doctor
                  </button>
                </div>
              </div>
            )}

            {/* Availability Tab */}
            {activeTab === 'availability' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold mb-3">Weekly Schedule</h3>
                {doctor.availability?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctor.availability.map((day) => (
                      <div key={day.day} className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <h4 className="font-semibold capitalize mb-2">{formatDay(day.day)}</h4>
                        {day.slots?.length > 0 ? (
                          <div className="space-y-1">
                            {day.slots.map((slot, idx) => (
                              <div key={idx} className="text-sm flex items-center">
                                <span className="w-20">{formatTime(slot.startTime)}</span>
                                <span className="mx-2">-</span>
                                <span>{formatTime(slot.endTime)}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">Not available</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No availability information.</p>
                )}

                {/* Rate Doctor Button */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-lg flex items-center gap-2"
                  >
                    <span>⭐</span>
                    Rate this Doctor
                  </button>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Patient Reviews</h3>
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition flex items-center gap-2"
                  >
                    <span>⭐</span> Write a Review
                  </button>
                </div>
                <ReviewsList targetType="doctor" targetId={doctor._id} />
              </div>
            )}

            {/* Book Appointment Button (shown in all tabs except reviews) */}
            {activeTab !== 'reviews' && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleBookAppointment}
                  className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition shadow-lg"
                >
                  Book Appointment with Dr. {doctor.name}
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Review Modal */}
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        targetType="doctor"
        targetId={doctor._id}
        targetName={doctor.name}
        onReviewSubmitted={handleReviewSubmitted}
      />
      
      <Footer />
    </div>
  );
};

export default DoctorProfilePage;