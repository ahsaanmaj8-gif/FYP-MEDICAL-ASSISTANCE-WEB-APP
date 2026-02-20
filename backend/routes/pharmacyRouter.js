const express = require('express');
const router = express.Router();
const { requireSignIn } = require('../middleware/authMiddleware');

// Import controller functions
const {
  getDashboardStats,
  getProfile,
  updateProfile
} = require('../Controllers/pharmacyController');

const {
  addMedicine,
  getAllMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine
} = require('../Controllers/medicineController');

const {
  getAllOrders,
  updateOrderStatus,
  getOrderDetails
} = require('../Controllers/orderController');
const { getEarnings } = require('../Controllers/earningsController');


// Import patient order controller
const { createOrder } = require('../Controllers/orderController');

// =======================
// DASHBOARD ROUTES
// =======================
router.get('/dashboard-stats', requireSignIn, getDashboardStats);

// =======================
// PROFILE ROUTES
// =======================
router.get('/profile', requireSignIn, getProfile);
router.put('/profile', requireSignIn, updateProfile);




// Add this route:
router.get('/earnings', requireSignIn, getEarnings);

// =======================
// MEDICINE ROUTES
// =======================
router.post('/medicines', requireSignIn, addMedicine);
router.get('/medicines', requireSignIn, getAllMedicines);
router.get('/medicines/:id', requireSignIn, getMedicineById);
router.put('/medicines/:id', requireSignIn, updateMedicine);
router.delete('/medicines/:id', requireSignIn, deleteMedicine);

// =======================
// ORDER ROUTES (FOR PHARMACY OWNERS)
// =======================
router.get('/orders', requireSignIn, getAllOrders);
router.get('/orders/:id', requireSignIn, getOrderDetails);
router.put('/orders/:id/status', requireSignIn, updateOrderStatus);

// =======================
// PATIENT ORDER CREATION (FOR PATIENTS TO ORDER FROM PHARMACY)
// =======================
router.post('/orders', requireSignIn, createOrder); // ✅ This should be line 33

module.exports = router;