const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Reference to Doctor
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  
  // Patient who wrote the review
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Reference to Appointment
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    // required: true
  },
  
  // Review Details
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  
  // Review Categories
  categories: {
    waitingTime: { type: Number, min: 1, max: 5 },
    staffFriendliness: { type: Number, min: 1, max: 5 },
    facilityCleanliness: { type: Number, min: 1, max: 5 }
  },
  
  // Status
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);