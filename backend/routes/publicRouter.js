const express = require("express");
const {
  getFeaturedDoctors,
  getAllDoctors,
  getDoctorById,
  getAllSpecialties,
  getPharmacyProducts,
  getLabTests,
  searchDoctors,
  getTestimonials
} = require("../controllers/publicController");
const { getTestById, getAvailableLabs } = require("../Controllers/labBookingController");


const {
  getFeaturedMedicines,
  searchMedicines,
  getMedicineDetails,
  getMedicineCategories
} = require('../controllers/publicController');


const router = express.Router();

// Public routes (no authentication required)
router.get("/featured-doctors", getFeaturedDoctors);
router.get("/doctors", getAllDoctors);
router.get("/doctors/:id", getDoctorById);
router.get("/specialties", getAllSpecialties);
router.get("/pharmacy-products", getPharmacyProducts);
router.get("/lab-tests", getLabTests);
router.get("/lab-tests/:testId", getTestById);
router.get("/labs", getAvailableLabs);
router.get("/search-doctors", searchDoctors);
router.get("/testimonials", getTestimonials);




// Pharmacy/Medicine Routes
router.get('/medicines/featured', getFeaturedMedicines);
router.get('/medicines/search', searchMedicines);
router.get('/medicines/:id', getMedicineDetails);
router.get('/medicines/categories', getMedicineCategories);



module.exports = router;