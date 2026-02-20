const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware');
const {
  getDoctorAvailability,
  bookAppointment,
  getPatientAppointments,
  cancelAppointment
} = require('../Controllers/appointmentController');

const {
  createJazzCashPayment,
  jazzCashResponse,
  checkPaymentStatus
} = require('../Controllers/paymentController');

// Public routes (no auth required for availability check)
router.get('/availability/:doctorId', getDoctorAvailability);

// Protected routes
router.post('/book', requireSignIn, bookAppointment);
router.get('/my-appointments', requireSignIn, getPatientAppointments);
router.put('/cancel/:id', requireSignIn, cancelAppointment);

// Payment routes
router.post('/payment/jazzcash/initiate', requireSignIn, createJazzCashPayment);
router.post('/payment/jazzcash/response', jazzCashResponse);
router.get('/payment/status/:transactionId', requireSignIn, checkPaymentStatus);

module.exports = router;