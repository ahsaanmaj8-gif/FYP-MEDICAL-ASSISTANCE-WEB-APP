import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import StarRating from './StarRating';

const ReviewModal = ({ isOpen, onClose, targetType, targetId, targetName, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [canReview, setCanReview] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isOpen && targetId) {
      checkIfCanReview();
    }
  }, [isOpen, targetId]);

 // In ReviewModal.jsx, update the checkIfCanReview function:

const checkIfCanReview = async () => {
  try {
    setChecking(true);
    const token = localStorage.getItem('token');
    
    // Check if token exists
    if (!token) {
      toast.error('Please login to leave a review');
      onClose();
      return;
    }

    const response = await axios.get(
      `http://localhost:8085/api/v1/reviews/check/${targetType}/${targetId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      setCanReview(response.data.data.canReview);
      if (response.data.data.alreadyReviewed) {
        toast.error('You have already reviewed this provider');
        onClose();
      } else if (!response.data.data.hasInteraction) {
        toast.error('You can only review after a completed appointment/order');
        onClose();
      }
    }
  } catch (error) {
    console.error('Error checking review status:', error);
    if (error.response?.status === 401) {
      toast.error('Session expired. Please login again');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else {
      toast.error('Failed to check review status');
      onClose();
    }
  } finally {
    setChecking(false);
  }
};

  const handleSubmit = async () => {
  if (rating === 0) {
    toast.error('Please select a rating');
    return;
  }

  try {
    setSubmitting(true);
    const token = localStorage.getItem('token');
    
    console.log('Token:', token); // Debug: Check if token exists
    console.log('Submitting review:', { targetType, targetId, rating });

    const response = await axios.post(
      'http://localhost:8085/api/v1/reviews',
      {
        targetType,
        targetId,
        rating
      },
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    console.log('Review response:', response.data);

    if (response.data.success) {
      toast.success('Thank you for your review! ⭐');
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.data);
      }
      onClose();
    }
  } catch (error) {
    console.error('Error submitting review:', error);
    console.error('Error response:', error.response?.data);
    
    if (error.response?.status === 401) {
      toast.error('Please login again');
      localStorage.removeItem('token');
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
    } else if (error.response?.status === 403) {
      toast.error(error.response?.data?.message || 'You cannot review this provider');
    } else {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    }
  } finally {
    setSubmitting(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

        {/* Modal */}
        <div className="relative bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="text-center mb-6">
            <div className="text-5xl mb-4">⭐</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Rate {targetName}
            </h2>
            <p className="text-gray-600">
              How was your experience? Select a rating below.
            </p>
          </div>

          {checking ? (
            <div className="text-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-gray-600">Checking...</p>
            </div>
          ) : !canReview ? (
            <div className="text-center py-6">
              <div className="text-4xl mb-3">⚠️</div>
              <p className="text-gray-700 mb-2">You can only review after a completed appointment/order.</p>
              <button
                onClick={onClose}
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <StarRating
                  rating={rating}
                  onRate={setRating}
                  size="lg"
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-sm text-gray-500">
                  {rating === 0 && 'Tap a star to rate'}
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent!'}
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting || rating === 0}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {submitting ? 'Submitting...' : 'Submit Rating'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;