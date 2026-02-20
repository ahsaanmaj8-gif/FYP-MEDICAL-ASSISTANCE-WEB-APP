const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Pharmacy = require('../models/Pharmacy');
const Laboratory = require('../models/Laboratory');
const Appointment = require('../models/Appointment');
const Order = require('../models/Order');
const LabBooking = require('../models/LabAppointment');

// =======================
// Submit a Review (for Doctor, Pharmacy, or Lab)
// =======================
// =======================
// Submit a Review
// =======================
exports.submitReview = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Please login to submit a review'
      });
    }

    const { targetType, targetId, rating } = req.body;
    const patientId = req.user._id;

    console.log('Review submission:', { targetType, targetId, rating, patientId });

    // Validation
    if (!targetType || !targetId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Target type, target ID, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if target exists
    let target = null;
    switch(targetType) {
      case 'doctor':
        target = await Doctor.findById(targetId);
        break;
      case 'pharmacy':
        target = await Pharmacy.findById(targetId);
        break;
      case 'laboratory':
        target = await Laboratory.findById(targetId);
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid target type'
        });
    }

    if (!target) {
      return res.status(404).json({
        success: false,
        message: `${targetType} not found`
      });
    }

    // Check if already reviewed
    let existingReview = null;
    if (targetType === 'doctor') {
      existingReview = await Review.findOne({ doctor: targetId, patient: patientId });
    } else if (targetType === 'pharmacy') {
      existingReview = await Review.findOne({ pharmacy: targetId, patient: patientId });
    } else if (targetType === 'laboratory') {
      existingReview = await Review.findOne({ laboratory: targetId, patient: patientId });
    }

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this provider'
      });
    }

    // Create review
    const reviewData = {
      patient: patientId,
      rating,
      isVerified: true
    };

    if (targetType === 'doctor') {
      reviewData.doctor = targetId;
    } else if (targetType === 'pharmacy') {
      reviewData.pharmacy = targetId;
    } else if (targetType === 'laboratory') {
      reviewData.laboratory = targetId;
    }

    const review = await Review.create(reviewData);

    // Update target's average rating
    let allReviews = [];
    if (targetType === 'doctor') {
      allReviews = await Review.find({ doctor: targetId });
    } else if (targetType === 'pharmacy') {
      allReviews = await Review.find({ pharmacy: targetId });
    } else if (targetType === 'laboratory') {
      allReviews = await Review.find({ laboratory: targetId });
    }

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    // Update the target's rating field
    target.rating = {
      average: averageRating,
      count: allReviews.length
    };
    await target.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: {
        review,
        averageRating,
        totalReviews: allReviews.length
      }
    });

  } catch (error) {
    console.error('Review submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// =======================
// Get Reviews for a Target
// =======================
exports.getReviews = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;

    let query = {};
    if (targetType === 'doctor') query.doctor = targetId;
    else if (targetType === 'pharmacy') query.pharmacy = targetId;
    else if (targetType === 'laboratory') query.laboratory = targetId;
    else {
      return res.status(400).json({
        success: false,
        message: 'Invalid target type'
      });
    }

    const reviews = await Review.find(query)
      .populate('patient', 'name profilePicture')
      .sort({ createdAt: -1 });

    // Calculate average
    const average = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    // Get rating distribution
    const distribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length
    };

    res.status(200).json({
      success: true,
      data: {
        reviews,
        average: average.toFixed(1),
        total: reviews.length,
        distribution
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};

// =======================
// Check if User Can Review
// =======================
exports.canReview = async (req, res) => {
  try {
    const { targetType, targetId } = req.params;
    const patientId = req.user._id;

    // Check if user has had a completed interaction
    let hasInteraction = false;
    let completedItem = null;

    switch(targetType) {
      case 'doctor':
        completedItem = await Appointment.findOne({
          doctor: targetId,
          patient: patientId,
          status: 'completed'
        }).sort({ createdAt: -1 });
        hasInteraction = !!completedItem;
        break;

      case 'pharmacy':
        completedItem = await Order.findOne({
          pharmacy: targetId,
          patient: patientId,
          status: 'delivered'
        }).sort({ createdAt: -1 });
        hasInteraction = !!completedItem;
        break;

      case 'laboratory':
        completedItem = await LabBooking.findOne({
          laboratory: targetId,
          patient: patientId,
          status: 'completed'
        }).sort({ createdAt: -1 });
        hasInteraction = !!completedItem;
        break;
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      ...(targetType === 'doctor' && { doctor: targetId }),
      ...(targetType === 'pharmacy' && { pharmacy: targetId }),
      ...(targetType === 'laboratory' && { laboratory: targetId }),
      patient: patientId
    });

    res.status(200).json({
      success: true,
      data: {
        canReview: hasInteraction && !existingReview,
        alreadyReviewed: !!existingReview,
        hasInteraction,
        completedItem
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check review status',
      error: error.message
    });
  }
};