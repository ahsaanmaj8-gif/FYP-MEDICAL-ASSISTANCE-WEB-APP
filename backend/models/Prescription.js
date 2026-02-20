const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  // Reference to Appointment
  appointment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  
  // Prescribing Doctor
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: true
  },
  
  // Patient Information
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Medical Details
  diagnosis: String,
  symptoms: [String],
  
  // Medicines Prescribed
  medicines: [{
    name: String,
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  
  // Tests Recommended
  tests: [{
    name: String,
    description: String,
    urgent: { type: Boolean, default: false }
  }],
  
  // General Instructions
  instructions: String,
  followUpDate: Date,
  
  // Digital Signature
  doctorSignature: String,
  issuedDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);