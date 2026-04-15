import client from './client';

export const orderService = {
  createOrder: async (orderData) => {
    const response = await client.post('/api/orders', orderData);
    return response.data;
  },
  getOrderById: async (orderId) => {
    const response = await client.get(`/api/orders/${orderId}`);
    return response.data;
  },
  getCustomerOrders: async (userId) => {
    const response = await client.get(`/api/orders/customer/${userId}`);
    return response.data;
  },
  getChefOrders: async (chefId) => {
    const response = await client.get(`/api/orders/chef/${chefId}`);
    return response.data;
  },
  updateOrderStatus: async (orderId, status) => {
    const response = await client.patch(`/api/orders/${orderId}/status`, { status });
    return response.data;
  }
};