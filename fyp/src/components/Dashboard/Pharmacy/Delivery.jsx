import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  const fetchDeliveryOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8085/api/v1/pharmacy/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        // Filter orders that require delivery
        const deliveryOrders = response.data.data.filter(
          order => order.deliveryType === 'delivery' && 
          ['ready', 'out-for-delivery'].includes(order.status)
        );
        setOrders(deliveryOrders);
      }
    } catch (error) {
      console.error('Error fetching delivery orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateDeliveryStatus = async (orderId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:8085/api/v1/pharmacy/orders/${orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchDeliveryOrders(); // Refresh
    } catch (error) {
      console.error('Error updating delivery:', error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🚚 Delivery Management</h1>

      {loading ? (
        <div className="text-center py-8">Loading deliveries...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No deliveries pending.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                  <p className="text-gray-600">Customer: {order.patient?.name}</p>
                  <p className="text-gray-600">Phone: {order.patient?.phone}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  order.status === 'ready' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                }`}>
                  {order.status === 'ready' ? 'Ready for Delivery' : 'Out for Delivery'}
                </span>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Delivery Address:</h4>
                <p className="text-gray-700">
                  {order.deliveryAddress?.street}<br/>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} {order.deliveryAddress?.zipCode}<br/>
                  {order.deliveryAddress?.country}
                </p>
                {order.deliveryInstructions && (
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-bold">Instructions:</span> {order.deliveryInstructions}
                  </p>
                )}
              </div>

              <div className="flex space-x-2">
                {order.status === 'ready' && (
                  <button
                    onClick={() => updateDeliveryStatus(order._id, 'out-for-delivery')}
                    className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700"
                  >
                    Start Delivery
                  </button>
                )}
                {order.status === 'out-for-delivery' && (
                  <button
                    onClick={() => updateDeliveryStatus(order._id, 'delivered')}
                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark Delivered
                  </button>
                )}
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Delivery;