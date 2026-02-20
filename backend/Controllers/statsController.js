const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const Pharmacy = require('../models/Pharmacy');
const Laboratory = require('../models/Laboratory');

// =======================
// Get Public Stats
// =======================
exports.getPublicStats = async (req, res) => {
  try {
    // Count verified doctors
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    
    // Count total users (patients)
    const totalPatients = await User.countDocuments({ role: 'user' });
    
    // Count total appointments (as a measure of happy patients)
    const totalAppointments = await Appointment.countDocuments({ status: 'completed' });
    
    // Count active users (users who have logged in recently - using appointments as proxy)
    const activeUsers = await Appointment.distinct('patient')
      .where('createdAt')
      .gte(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)); // Last 30 days

    // Count total pharmacies
    const totalPharmacies = await Pharmacy.countDocuments({ isVerified: true });
    
    // Count total laboratories
    const totalLaboratories = await Laboratory.countDocuments({ isVerified: true });

    res.json({
      success: true,
      data: {
        verifiedDoctors,
        happyPatients: totalAppointments, // Using completed appointments as happy patients count
        activeUsers: activeUsers.length || totalPatients,
        totalPharmacies,
        totalLaboratories
      }
    });

  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};

// =======================
// Get Homepage Stats (Simplified)
// =======================
exports.getHomepageStats = async (req, res) => {
  try {
    const verifiedDoctors = await Doctor.countDocuments({ isVerified: true });
    const totalPatients = await User.countDocuments({ role: 'user' });
    const totalAppointments = await Appointment.countDocuments();

    res.json({
      success: true,
      data: {
        verifiedDoctors,
        happyPatients: totalPatients,
        totalAppointments,
        supportAvailable: true
      }
    });

  } catch (error) {
    console.error('Error fetching homepage stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics'
    });
  }
};