const express = require('express');
const {
  getDashboardStats,
  getTests,
  addTest,
  updateTestStatus,
  getAppointments,
  updateAppointmentStatus,
  uploadReport,
  getEarnings
} = require('../controllers/labController');
const { requireSignIn } = require('../middleware/authMiddleware');

const router = express.Router();
const cloudinaryFileUploader = require("../middleware/fileuploader.js");


// All routes require authentication
router.use(requireSignIn);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Test Management
router.get('/tests', getTests);
router.post('/tests', addTest);
router.put('/tests/:testId/status', updateTestStatus);

// Appointments
router.get('/appointments', getAppointments);
router.put('/appointments/:appointmentId/status', updateAppointmentStatus);

// Reports
router.post('/appointments/:appointmentId/report',cloudinaryFileUploader.single("reportFile"), uploadReport);

// Earnings
router.get('/earnings', getEarnings);

module.exports = router;