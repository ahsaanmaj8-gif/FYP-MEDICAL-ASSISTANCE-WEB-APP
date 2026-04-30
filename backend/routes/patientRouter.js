const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware');
const {
  createOrder,
  getPatientOrders,
  getOrderDetails,
  cancelOrder
} = require('../Controllers/orderController');



const {
  getDashboardStats,
  getAppointments,
  cancelAppointment,
  getPrescriptions,
  getPrescriptionById,
  getOrders,
  getLabTests,
  getProfile,
  updateProfile,
  getRecentActivity
} = require('../Controllers/patientController');


router.use(requireSignIn);





// Dashboard
router.get('/dashboard', getDashboardStats);
router.get('/recent-activity', getRecentActivity);

// Appointments
router.get('/appointments', getAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);

// Prescriptions
router.get('/prescriptions', getPrescriptions);
router.get('/prescriptions/:id', getPrescriptionById);


// Orders
router.get('/orders', getOrders);

// Lab Tests
router.get('/lab-tests', getLabTests);

// Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Patient Order Routes
router.post('/orders', requireSignIn, createOrder);
router.get('/orders', requireSignIn, getPatientOrders);
router.get('/orders/:id', requireSignIn, getOrderDetails);
router.put('/orders/:id/cancel', requireSignIn, cancelOrder);

module.exports = router;


