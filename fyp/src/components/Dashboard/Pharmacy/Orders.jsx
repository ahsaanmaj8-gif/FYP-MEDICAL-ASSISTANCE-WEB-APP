import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Backend_Url } from './../../../../utils/utils';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      console.log('Fetching orders with token:', token ? 'Present' : 'Missing');
      
      const response = await axios.get(`${Backend_Url}/pharmacy/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Orders API response:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.data);
        console.log(`Loaded ${response.data.data.length} orders`);
      } else {
        setError(response.data.message || 'Failed to load orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${Backend_Url}/pharmacy/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        fetchOrders(); // Refresh orders
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'out-for-delivery': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">🛒 Customer Orders</h1>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8 text-gray-600">No orders yet.</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order._id} className="bg-white rounded-2xl p-6 shadow-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg">Order #{order.orderNumber}</h3>
                  <p className="text-gray-600">
                    Customer: {order.patient?.name}
                  </p>
                  <p className="text-gray-600">
                    Phone: {order.patient?.phone}
                  </p>
                  <p className="text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-xl font-bold mt-2">Rs.{order.totalAmount}</p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-bold mb-2">Items:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{item.medicine?.name} x{item.quantity}</span>
                      <span>Rs.{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                {order.status === 'pending' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'processing')}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Start Processing
                  </button>
                )}
                {order.status === 'processing' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'ready')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Mark as Ready
                  </button>
                )}
                {order.status === 'ready' && order.deliveryType === 'delivery' && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'out-for-delivery')}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
                  >
                    Out for Delivery
                  </button>
                )}
                {(order.status === 'ready' || order.status === 'out-for-delivery') && (
                  <button
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;