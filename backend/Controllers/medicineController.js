const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');

// =======================
// Add New Medicine
// =======================
const addMedicine = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    const medicineData = {
      ...req.body,
      pharmacy: pharmacy._id
    };

    const medicine = await Medicine.create(medicineData);
    
    res.status(201).json({
      success: true,
      message: 'Medicine added successfully',
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get All Medicines
// =======================
const getAllMedicines = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    const medicines = await Medicine.find({ pharmacy: pharmacy._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: medicines
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Medicine By ID
// =======================
const getMedicineById = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    const medicine = await Medicine.findOne({ 
      _id: id, 
      pharmacy: pharmacy._id 
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.status(200).json({
      success: true,
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Update Medicine
// =======================
const updateMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    
    const medicine = await Medicine.findOne({ _id: id, pharmacy: pharmacy._id });
    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    Object.assign(medicine, req.body);
    await medicine.save();

    res.status(200).json({
      success: true,
      message: 'Medicine updated successfully',
      data: medicine
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Delete Medicine
// =======================
const deleteMedicine = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    
    const medicine = await Medicine.findOneAndDelete({ 
      _id: id, 
      pharmacy: pharmacy._id 
    });

    if (!medicine) {
      return res.status(404).json({ success: false, message: 'Medicine not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Medicine deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addMedicine,
  getAllMedicines,
  getMedicineById,  // ✅ ADDED THIS
  updateMedicine,
  deleteMedicine
};