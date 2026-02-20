const mongoose = require('mongoose');

const labAppointmentSchema = new mongoose.Schema({
  laboratory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Laboratory',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // Remove required: true to allow guest bookings
    default: null
  },
  testName: {
    type: String,
    required: true
  },
  testId: {
    type: String, // Changed from ObjectId to String
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  patientAge: Number,
  patientGender: String,
  patientPhone: {
    type: String,
    required: true
  },
  collectionDate: {
    type: Date,
    required: true
  },
  collectionType: {
    type: String,
    enum: ['home', 'lab'],
    default: 'lab'
  },
  address: String,
  notes: String,
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'sample_collected', 'processing', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending'
  },
  reportUrl: String,
  reportUploadedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LabAppointment', labAppointmentSchema);