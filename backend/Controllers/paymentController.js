// =======================
// JazzCash Payment Integration (Mock for Demo)
// =======================

// JazzCash configuration (sandbox)
const jazzCashConfig = {
  MERCHANT_ID: 'MC604531', // Your provided merchant ID
  PASSWORD: 'your-password', // Placeholder
  INTEGRITY_SALT: 'your-salt', // Placeholder
  RETURN_URL: 'http://localhost:8085/api/v1/payment/jazzcash/response',
  CURRENCY: 'PKR',
  VERSION: '1.1'
};

// Generate JazzCash payment form
exports.createJazzCashPayment = async (req, res) => {
  try {
    const { amount, orderId, description } = req.body;

    // Create transaction ID
    const txRef = 'TXN' + Date.now();
    
    // Mock payment data
    const paymentData = {
      pp_Version: jazzCashConfig.VERSION,
      pp_TxnType: 'MPAY',
      pp_Language: 'EN',
      pp_MerchantID: jazzCashConfig.MERCHANT_ID,
      pp_SubMerchantID: '',
      pp_Password: jazzCashConfig.PASSWORD,
      pp_TxnRefNo: txRef,
      pp_Amount: amount * 100, // Convert to paisa
      pp_TxnCurrency: jazzCashConfig.CURRENCY,
      pp_TxnDateTime: new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
      pp_BillReference: 'billRef',
      pp_Description: description || 'Appointment Payment',
      pp_TxnExpiryDateTime: new Date(Date.now() + 86400000).toISOString().replace(/[-:T.Z]/g, '').slice(0, 14),
      pp_ReturnURL: jazzCashConfig.RETURN_URL,
      pp_SecureHash: '', // Will generate
      ppmpf_1: orderId,
      ppmpf_2: 'appointment',
      ppmpf_3: '',
      ppmpf_4: '',
      ppmpf_5: ''
    };

    // Generate secure hash (mock for demo)
    paymentData.pp_SecureHash = 'MOCK_HASH_' + Date.now();

    res.status(200).json({
      success: true,
      message: 'JazzCash payment initiated',
      data: {
        formData: paymentData,
        paymentUrl: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transaction',
        transactionId: txRef
      }
    });

  } catch (error) {
    console.error('JazzCash payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment initiation failed',
      error: error.message
    });
  }
};

// JazzCash payment response handler
exports.jazzCashResponse = async (req, res) => {
  try {
    const response = req.body;
    
    console.log('JazzCash Response:', response);

    // Mock success response
    res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        transactionId: response.pp_TxnRefNo,
        amount: response.pp_Amount / 100,
        status: 'SUCCESS',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing failed',
      error: error.message
    });
  }
};

// Check payment status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Mock status check
    res.status(200).json({
      success: true,
      data: {
        transactionId,
        status: 'PAID',
        amount: 0,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to check payment status',
      error: error.message
    });
  }
};