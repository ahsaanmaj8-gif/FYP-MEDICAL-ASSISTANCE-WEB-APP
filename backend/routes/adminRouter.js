const express = require('express');
const { 
  getDoctors, 
  verifyDoctor, 
  rejectDoctor,
  getPharmacies,
  verifyPharmacy,
  rejectPharmacy,
  getLaboratories,
  verifyLaboratory,
  rejectLaboratory,
  getDashboardStats
} = require('../Controllers/adminController');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Dashboard Stats
router.get('/dashboard-stats', requireSignIn, isAdmin, getDashboardStats);

// Doctor Management
router.get('/doctors', requireSignIn, isAdmin, getDoctors);
router.put('/doctors/:id/verify', requireSignIn, isAdmin, verifyDoctor);
router.put('/doctors/:id/reject', requireSignIn, isAdmin, rejectDoctor);

// Pharmacy Management
router.get('/pharmacies', requireSignIn, isAdmin, getPharmacies);
router.put('/pharmacies/:id/verify', requireSignIn, isAdmin, verifyPharmacy);
router.put('/pharmacies/:id/reject', requireSignIn, isAdmin, rejectPharmacy);

// Laboratory Management
router.get('/laboratories', requireSignIn, isAdmin, getLaboratories);
router.put('/laboratories/:id/verify', requireSignIn, isAdmin, verifyLaboratory);
router.put('/laboratories/:id/reject', requireSignIn, isAdmin, rejectLaboratory);

module.exports = router;