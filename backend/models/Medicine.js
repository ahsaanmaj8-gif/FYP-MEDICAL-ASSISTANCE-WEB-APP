const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: true
  },
  genericName: String,
  brand: String,
  
  // Medicine Details
  type: {
    type: String,
    enum: ['tablet', 'capsule', 'syrup', 'injection', 'ointment', 'drops', 'inhaler'],
    required: true
  },
  strength: String,
  package: String,
  
  // Medical Information
  category: String,
  composition: [String],
  uses: [String],
  sideEffects: [String],
  contraindications: [String],
  
  // Pricing & Inventory
  price: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    default: 0
  },
  stock: {
    type: Number,
    required: true
  },
  
  // Pharmacy Reference
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  
  // Prescription Requirement
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  
  // Images
  images: [String],
  
  // Status
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

module.exports = mongoose.model('Medicine', medicineSchema);