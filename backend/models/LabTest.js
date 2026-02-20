const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema({
  // name: {
  //   type: String,
  //   required: true
  // },
   testName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  duration: {
    type: String,
    default: '24 hours'
  },
  description: String,
  laboratory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabTest', labTestSchema);