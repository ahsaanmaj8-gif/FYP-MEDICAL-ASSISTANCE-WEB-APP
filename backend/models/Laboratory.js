const mongoose = require('mongoose');

const laboratorySchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Laboratory Information
  labName: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
  },

  // Add this to laboratorySchema
rating: {
  average: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
},
  
  // Contact Information
  phone: String,
  email: String,
  
  // Address
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Services
  testsAvailable: [{
    testName: String,
    category: String,
    price: Number,
    duration: String, // How long it takes to get results
    description: String
  }],
  
  // Business Hours
  businessHours: [{
    day: String,
    openTime: String,
    closeTime: String,
    isOpen: Boolean
  }],
  
  // Home Collection Service
  homeCollectionAvailable: {
    type: Boolean,
    default: false
  },
  


   rejectionReason: {
    type: String,
    default: ""
  },
  rejectedAt: {  // ✅ ADD THIS
    type: Date
  },
  verifiedAt: {  // ✅ ADD THIS
    type: Date
  },


  
  // Verification
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

module.exports = mongoose.model('Laboratory', laboratorySchema);