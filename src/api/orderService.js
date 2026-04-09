import client from './client';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await client.post('/orders', orderData);
    return response.data;
  },
  getCustomerOrders: async (userId) => {
    const response = await client.get(`/orders/customer/${userId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await client.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  }
};