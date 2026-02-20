// controllers/earningsController.js - SIMPLE VERSION
const Order = require('../models/Order');
const Pharmacy = require('../models/Pharmacy');

exports.getEarnings = async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    if (!pharmacy) {
      return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    }

    // Get current month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Total earnings (all delivered orders)
    const totalOrders = await Order.find({
      pharmacy: pharmacy._id,
      status: 'delivered'
    });

    const totalEarnings = totalOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // This month earnings
    const thisMonthOrders = totalOrders.filter(order => 
      order.createdAt >= thisMonthStart && order.createdAt <= thisMonthEnd
    );
    const thisMonthEarnings = thisMonthOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Pending payout (ready or out-for-delivery orders)
    const pendingOrders = await Order.find({
      pharmacy: pharmacy._id,
      status: { $in: ['ready', 'out-for-delivery'] }
    });
    const pendingPayout = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);

    // Total orders count
    const totalOrdersCount = await Order.countDocuments({ pharmacy: pharmacy._id });

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalEarnings,
          thisMonth: thisMonthEarnings,
          pendingPayout,
          totalOrders: totalOrdersCount
        }
      }
    });

  } catch (error) {
    console.error('Earnings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get earnings'
    });
  }
};