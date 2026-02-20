const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware');

const {
  getDashboardStats,
  getAppointments,
  updateAppointmentStatus,
  getPatients,
  getPatientDetails,
  getEarnings,
  getProfile,
  updateProfile,
  getSchedule,
  updateSchedule
} = require('../Controllers/doctorController');

const {
  createPrescription,
  getPrescriptions,
  getPrescriptionById
} = require('../Controllers/prescriptionController');

// All routes require authentication
router.use(requireSignIn);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Appointments
router.get('/appointments', getAppointments);
// router.put('/appointments/:id/status', updateAppointmentStatus);
router.put('/appointments/:id/status', requireSignIn, updateAppointmentStatus);

// Patients
router.get('/patients', getPatients);
router.get('/patients/:id', getPatientDetails);

// Prescriptions
router.post('/prescriptions', createPrescription);
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions/:id', getPrescriptionById);

// Earnings
router.get('/earnings', getEarnings);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Schedule
router.get('/schedule', getSchedule);
router.put('/schedule', requireSignIn, updateSchedule);

module.exports = router;