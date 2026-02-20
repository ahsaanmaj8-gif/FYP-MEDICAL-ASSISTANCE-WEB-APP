const mongoose = require('mongoose');

const symptomSchema = new mongoose.Schema({
  // Symptom Information
  symptomName: {
    type: String,
    required: true,
    unique: true
  },
  
  // Medical Information
  category: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  
  // Related Information
  relatedSymptoms: [String],
  possibleConditions: [{
    condition: String,
    probability: Number
  }],
  
  // Doctor Specialization Mapping
  recommendedSpecializations: [String],
  
  // Emergency Level
  isEmergency: {
    type: Boolean,
    default: false
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Symptom', symptomSchema);