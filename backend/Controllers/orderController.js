const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const Pharmacy = require('../models/Pharmacy');
const User = require('../models/User');

// =======================
// Create Order (Patient)
// =======================
const createOrder = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Debug log
    
    // Check if FormData or JSON
    let medicineId, quantity, deliveryInstructions, deliveryDate, deliveryTime, deliveryAddress;
    
    if (req.headers['content-type'] && req.headers['content-type'].includes('multipart/form-data')) {
      // Handle FormData
      medicineId = req.body.medicineId;
      quantity = req.body.quantity;
      deliveryInstructions = req.body.deliveryInstructions;
      deliveryDate = req.body.deliveryDate;
      deliveryTime = req.body.deliveryTime;
      
      // Parse deliveryAddress if it's a JSON string
      if (req.body.deliveryAddress) {
        try {
          deliveryAddress = JSON.parse(req.body.deliveryAddress);
        } catch (err) {
          deliveryAddress = {
            street: req.body.address || '',
            city: req.body.city || '',
            state: '',
            zipCode: '',
            country: 'Pakistan'
          };
        }
      }
    } else {
      // Handle JSON
      ({ 
        medicineId, 
        quantity, 
        deliveryInstructions, 
        deliveryDate, 
        deliveryTime,
        deliveryAddress 
      } = req.body);
    }

    // Validate required fields
    if (!medicineId || !quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Medicine ID and quantity are required'
      });
    }

    // Get medicine details
    const medicine = await Medicine.findById(medicineId)
      .populate('pharmacy', 'pharmacyName phone address deliveryAvailable deliveryRadius isVerified');
    
    if (!medicine || !medicine.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Medicine not found or unavailable'
      });
    }

    // Check if pharmacy is verified
    if (!medicine.pharmacy.isVerified) {
      return res.status(403).json({
        success: false,
        message: 'Pharmacy is not verified'
      });
    }

    // Check stock
    if (medicine.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${medicine.stock} items available in stock`
      });
    }

    // Calculate price
    const unitPrice = medicine.discount > 0 
      ? medicine.price * (100 - medicine.discount) / 100 
      : medicine.price;
    
    const totalAmount = unitPrice * quantity;

    // Generate order number
    const orderNumber = 'ORD' + Date.now() + Math.floor(Math.random() * 1000);

    // Create order
    const order = await Order.create({
      orderNumber,
      patient: req.user._id,
      pharmacy: medicine.pharmacy._id,
      items: [{
        medicine: medicine._id,
        quantity: parseInt(quantity),
        price: unitPrice
      }],
      totalAmount,
      deliveryAddress: deliveryAddress || {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Pakistan'
      },
      deliveryType: 'delivery',
      deliveryInstructions: deliveryInstructions || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    // Update medicine stock
    medicine.stock -= parseInt(quantity);
    await medicine.save();

    console.log('Order created successfully:', order._id); // Debug log

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        totalAmount,
        estimatedDelivery: deliveryDate || 'Tomorrow'
      }
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to place order',
      error: error.message
    });
  }
};

// =======================
// Get Patient Orders
// =======================
const getPatientOrders = async (req, res) => {

  try {
    const orders = await Order.find({ patient: req.user._id })
      .populate('pharmacy', 'pharmacyName phone')
      .populate('items.medicine', 'name type strength')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// =======================
// Get Order Details (Patient)
// =======================
const getOrderDetails = async (req, res) => {

// exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({ _id: id, patient: req.user._id })
      .populate('pharmacy', 'pharmacyName phone address')
      .populate('items.medicine', 'name type strength price');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order details',
      error: error.message
    });
  }
};

// =======================
// Cancel Order (Patient)
// =======================
const cancelOrder = async (req, res) => {

// exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findOne({ _id: id, patient: req.user._id });
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    // Update order status
    order.status = 'cancelled';
    order.cancellationReason = req.body.reason || 'Cancelled by patient';
    await order.save();

    // Restock medicine if needed
    if (order.items.length > 0) {
      const medicine = await Medicine.findById(order.items[0].medicine);
      if (medicine) {
        medicine.stock += order.items[0].quantity;
        await medicine.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};



// =======================
// Get All Orders (Pharmacy)
// =======================
// Make sure your getAllOrders function looks like this:
const getAllOrders = async (req, res) => {
  try {
    console.log('Fetching orders for pharmacy...');
    
    // Find the pharmacy owned by the logged-in user
    const pharmacy = await Pharmacy.findOne({ user: req.user._id });
    
    console.log('Pharmacy found:', pharmacy?._id);
    
    if (!pharmacy) {
      return res.status(404).json({ 
        success: false, 
        message: 'Pharmacy not found' 
      });
    }

    // Find orders for this pharmacy
    const orders = await Order.find({ pharmacy: pharmacy._id })
      .populate('patient', 'name email phone')
      .populate('items.medicine', 'name price type strength')
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} orders for pharmacy ${pharmacy.pharmacyName}`);
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error in getAllOrders:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// =======================
// Update Order Status (Pharmacy)
// =======================
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};


module.exports = {
  

  cancelOrder,
  getOrderDetails,
  getPatientOrders,
  createOrder,
  getAllOrders,
  updateOrderStatus
};



