import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const MedicineOrderPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('14:00');
  const [instructions, setInstructions] = useState('');
  const [prescription, setPrescription] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to place an order');
      navigate('/login', { state: { from: `/pharmacy/order/${productId}` } });
      return;
    }
    
    fetchProduct();
  }, [productId]);

  // Fetch product details
// Update the fetchProduct function:
const fetchProduct = async () => {
  try {
    setLoading(true);
    
    // PUBLIC endpoint - no token required
    const response = await axios.get(
      `http://localhost:8085/api/v1/public/medicines/${productId}`
    );
    
    if (response.data.success) {
      const productData = response.data.data;
      
      // Check if pharmacy is verified
      if (!productData.pharmacyVerified) {
        toast.error('This medicine is from an unverified pharmacy');
        navigate('/pharmacy');
        return;
      }
      
      setProduct(productData);
      
      // Set tomorrow as default delivery date
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeliveryDate(tomorrow.toISOString().split('T')[0]);
      
      // Get patient info from profile (this requires auth)
      await fetchPatientProfile();
    } else {
      toast.error('Medicine not found');
      navigate('/pharmacy');
    }
  } catch (err) {
    console.error('Error fetching product:', err);
    
    // If 403, try with authentication
    if (err.response?.status === 403) {
      await fetchProductWithAuth();
    } else {
      toast.error('Failed to load medicine details');
      navigate('/pharmacy');
    }
  } finally {
    setLoading(false);
  }
};

// Alternative function with authentication
const fetchProductWithAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token');
    
    const response = await axios.get(
      `http://localhost:8085/api/v1/public/medicines/${productId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      setProduct(response.data.data);
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDeliveryDate(tomorrow.toISOString().split('T')[0]);
    }
  } catch (authErr) {
    console.error('Auth fetch failed:', authErr);
    throw authErr;
  }
}; 
  // Fetch patient profile for autofill
  const fetchPatientProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        const user = response.data.user;
        setPatientName(user.name || '');
        setPatientPhone(user.phone || '');
        
        if (user.address) {
          setAddress(user.address.street || '');
          setCity(user.address.city || '');
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      // Continue without autofill
    }
  };

  const calculateTotal = () => {
    if (!product) return '0.00';
    
    const price = product.discount > 0 
      ? product.price * (100 - product.discount) / 100 
      : product.price;
    
    return (price * quantity).toFixed(2);
  };

  const totalAmount = calculateTotal();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, JPG, or PDF files are allowed');
      return;
    }
    
    setPrescription(file);
  };

  // Update the handleSubmit function in MedicineOrderPage.jsx:

// In MedicineOrderPage.jsx - Update handleSubmit function:

const handleSubmit = async (e) => {
  e.preventDefault();

  // Validation
  if (!patientName || !patientPhone || !address || !city || !deliveryDate) {
    toast.error('Please fill all required fields');
    return;
  }

  if (product.prescriptionRequired && !prescription) {
    toast.error('Please upload your prescription');
    return;
  }

  if (quantity > product.stock) {
    toast.error(`Only ${product.stock} items available in stock`);
    return;
  }

  try {
    setOrderLoading(true);

    const token = localStorage.getItem('token');
    
    // Create order data as JSON (not FormData)
    const orderData = {
      medicineId: product._id,
      quantity: quantity,
      deliveryInstructions: instructions,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      deliveryAddress: {
        street: address,
        city: city,
        state: '',
        zipCode: '',
        country: 'Pakistan'
      }
    };

    console.log('Sending order data:', orderData); // Debug log

    // Send as JSON
    const response = await axios.post(
      'http://localhost:8085/api/v1/patient/orders',
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (response.data.success) {
      toast.success('Order placed successfully! 💊');
      
      // Show order details
      toast.success(`Order #${response.data.data.orderNumber} - Total: ${response.data.data.totalAmount}`);
      
      // Redirect to patient orders page
      setTimeout(() => {
        navigate('/patient/pharmacy-orders');
      }, 2000);
    }

  } catch (err) {
    console.error('Order error:', err.response?.data || err);
    
    const errorMsg = err.response?.data?.message || 'Order failed. Please try again.';
    toast.error(errorMsg);
  } finally {
    setOrderLoading(false);
  }
};
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading medicine details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-green-100">
        <div className="text-center">
          <div className="text-6xl mb-4">💊</div>
          <h2 className="text-2xl font-bold mb-2">Medicine Not Found</h2>
          <p className="text-gray-600 mb-4">The medicine you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/pharmacy')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Back to Pharmacy
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/pharmacy')}
            className="flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <span className="mr-2">←</span>
            Back to Pharmacy
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Order Medicine
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Card - Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              {/* Product Info */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-3">💊</div>
                <h2 className="text-xl font-bold text-gray-800">{product.name}</h2>
                {product.genericName && (
                  <p className="text-gray-500 text-sm">{product.genericName}</p>
                )}
                <p className="text-gray-500">{product.strength}</p>
              </div>

              {/* Product Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Brand:</span>
                  <span className="font-medium">{product.brand || 'Generic'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="capitalize font-medium">{product.type}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-medium">{product.category || 'General'}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className={`font-medium ${product.stock < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.stock} units
                  </span>
                </div>
                {product.prescriptionRequired && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Prescription:</span>
                    <span className="font-medium text-purple-600">Required</span>
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Price:</span>
                  <div className="text-right">
                    {product.discount > 0 ? (
                      <>
                        <span className="line-through text-gray-400 text-sm">
                          {product.price}
                        </span>
                        <span className="ml-2 text-xl font-bold text-green-600">
                          {(product.price * (100 - product.discount) / 100).toFixed(2)}
                        </span>
                        <div className="text-xs text-green-800 bg-green-100 px-2 py-1 rounded-full inline-block mt-1">
                          {product.discount}% OFF
                        </div>
                      </>
                    ) : (
                      <span className="text-xl font-bold text-green-600">
                        {product.price}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-l-lg hover:bg-gray-200"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <div className="w-16 h-10 flex items-center justify-center border-y bg-white">
                    {quantity}
                  </div>
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-r-lg hover:bg-gray-200"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Max: {product.stock} units
                </p>
              </div>

              {/* Total Price */}
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-700">
                    {totalAmount}
                  </span>
                </div>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <span className="mr-1">💵</span>
                  Cash on Delivery Available
                </p>
              </div>
            </div>
          </div>

          {/* Order Form - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
                Delivery Details
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Patient Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="03XX XXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="2"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="House/Flat No., Street, Area"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      placeholder="Enter city"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Date *
                    </label>
                    <input
                      type="date"
                      value={deliveryDate}
                      onChange={(e) => setDeliveryDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                      required
                    />
                  </div>
                </div>

                {/* Delivery Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Delivery Time
                  </label>
                  <select
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  >
                    <option value="09:00">9:00 AM – 12:00 PM</option>
                    <option value="14:00">2:00 PM – 5:00 PM</option>
                    <option value="18:00">6:00 PM – 9:00 PM</option>
                  </select>
                </div>

                {/* Prescription Upload (if required) */}
                {product.prescriptionRequired && (
                  <div className="border border-purple-200 rounded-xl p-4 bg-purple-50">
                    <label className="block text-sm font-medium text-purple-700 mb-2">
                      📄 Upload Prescription (Required)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="w-full px-4 py-2.5 border-2 border-dashed border-purple-300 rounded-lg bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {prescription && (
                      <p className="text-sm text-green-600 mt-2">
                        ✓ {prescription.name} uploaded
                      </p>
                    )}
                    <p className="text-xs text-purple-600 mt-2">
                      Accepted: JPG, PNG, PDF (Max 5MB)
                    </p>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                    placeholder="Any special delivery instructions..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={orderLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {orderLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Placing Order...
                    </span>
                  ) : (
                    'Place Order (Cash on Delivery)'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineOrderPage;