import client from './client';

export const adminService = {
  getPendingChefs: async () => {
    const response = await client.get('/chefs?status=eq.pending');
    return response.data;
  },
  updateChefStatus: async (chefId, status) => {
    const response = await client.patch(`/chefs?id=eq.${chefId}`, { status });
    return response.data;
  },
  getAllOrders: async () => {
    const response = await client.get('/orders');
    return response.data;
  },
  getSystemStats: async () => {
    const response = await client.get('/users');
    return response.data;
  }
};