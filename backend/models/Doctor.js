const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Professional Information
  specialization: {
    type: String,
    required: [true, 'Please provide specialization']
  },
  qualifications: [{
    degree: String,
    institute: String,
    year: Number
  }],
  experience: {
    type: Number,
    required: [true, 'Please provide experience in years']
  },
  bio: {
    type: String,
    maxlength: 500
  },
  
  // Professional Documents
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },
  certificates: [String],
  
  // Practice Information
  hospital: {
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String
    }
  },
  
  // Consultation Details
  consultationFee: {
    type: Number,
    required: true
  },
  followUpFee: {
    type: Number,
    default: 0
  },
  
  // NEW: Video Consultation Option
  videoConsultationAvailable: {
    type: Boolean,
    default: false
  },
  
  // Availability & Schedule
  availability: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    slots: [{
      startTime: String,
      endTime: String,
      isAvailable: {
        type: Boolean,
        default: true
      }
    }]
  }],
  
  // Services Offered
  services: [String],
  
  // Ratings & Reviews
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  rejectionReason: {
    type: String,
    default: ""
  },
  rejectedAt: {
    type: Date
  },
  verifiedAt: {
    type: Date
  },

  // Verification Status
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

module.exports = mongoose.model('Doctor', doctorSchema);