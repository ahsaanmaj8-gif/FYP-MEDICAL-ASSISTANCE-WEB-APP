const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Order Information
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  
  // Patient Information
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Pharmacy Information
  pharmacy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pharmacy',
    required: true
  },
  
  // Order Items
  items: [{
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medicine',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],
  
  // Order Details
  totalAmount: {
    type: Number,
    required: true
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Payment Information
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },


  //   prescriptionUrl: {
  //   type: String,
  //   default: null
  // },
  prescriptionRequired: {
    type: Boolean,
    default: false
  },
  prescriptionVerified: {
    type: Boolean,
    default: false
  },



  //this work as a prescription picture i used this 
  profilePicture: {
    type: String,
    default: ''
  },

  
  // Delivery Information
  deliveryType: {
    type: String,
    enum: ['pickup', 'delivery'],
    default: 'delivery'
  },
  deliveryInstructions: String,
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);