const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  // Reference to User
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Pharmacy Information
  pharmacyName: {
    type: String,
    required: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true
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
  
  // Business Hours
  businessHours: [{
    day: String,
    openTime: String,
    closeTime: String,
    isOpen: Boolean
  }],
  


//   rejectionReason: {
//   type: String,
//   default: ""
// },


rejectionReason: {
    type: String,
    default: ""
  },
  rejectedAt: {  // ✅ ADD THIS MISSING FIELD
    type: Date
  },
  verifiedAt: {  // ✅ ADD THIS FIELD
    type: Date
  },


  // Delivery Information
  deliveryAvailable: {
    type: Boolean,
    default: false
  },
  deliveryRadius: Number, // in kilometers
  

  // Add this to pharmacySchema
rating: {
  average: { type: Number, default: 0 },
  count: { type: Number, default: 0 }
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

module.exports = mongoose.model('Pharmacy', pharmacySchema);
