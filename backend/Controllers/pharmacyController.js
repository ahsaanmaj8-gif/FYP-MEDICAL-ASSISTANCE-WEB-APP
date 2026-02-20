const Pharmacy = require('../models/Pharmacy');
const Medicine = require('../models/Medicine');
const Order = require('../models/Order');
const User = require('../models/User');
const bcrypt = require('bcrypt');

// =======================
// Get Pharmacy Dashboard Stats
// =======================


const getDashboardStats = async (req, res) => {

  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    const totalOrders = await Order.countDocuments({ pharmacy: pharmacy._id });
    const pendingOrders = await Order.countDocuments({ 
      pharmacy: pharmacy._id, 
      status: 'pending' 
    });
    const lowStockMedicines = await Medicine.countDocuments({ 
      pharmacy: pharmacy._id, 
      stock: { $lt: 10 } 
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRevenue = await Order.aggregate([
      { 
        $match: { 
          pharmacy: pharmacy._id, 
          status: 'delivered',
          createdAt: { $gte: today }
        }
      },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        lowStockMedicines,
        todayRevenue: todayRevenue[0]?.total || 0,
        isVerified: pharmacy.isVerified,
        pharmacyName: pharmacy.pharmacyName
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Get Pharmacy Profile
// =======================
const getProfile = async (req, res) => {

  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id })
      .populate('user', 'name email phone');
    
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    res.status(200).json({ success: true, data: pharmacy });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// =======================
// Update Pharmacy Profile
// =======================
const updateProfile = async (req, res) => {

  try {
    const { pharmacyName, phone, address, businessHours, deliveryAvailable, deliveryRadius } = req.body;
    
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    // Update pharmacy fields
    if (pharmacyName) pharmacy.pharmacyName = pharmacyName;
    if (phone) pharmacy.phone = phone;
    if (address) pharmacy.address = address;
    if (businessHours) pharmacy.businessHours = businessHours;
    if (deliveryAvailable !== undefined) pharmacy.deliveryAvailable = deliveryAvailable;
    if (deliveryRadius) pharmacy.deliveryRadius = deliveryRadius;

    await pharmacy.save();

    res.status(200).json({ 
      success: true, 
      message: 'Profile updated successfully',
      data: pharmacy 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


module.exports = {
  updateProfile,
  getProfile,
  getDashboardStats,
  
}