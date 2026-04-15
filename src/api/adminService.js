import client from './client';

export const adminService = {
  getPendingChefs: async () => {
    const response = await client.get('/api/admin/pending-chefs');
    return response.data;
  },
  updateChefStatus: async (chefId, status) => {
    const response = await client.patch(`/api/admin/verify-chef/${chefId}`, { status });
    return response.data;
  },
  getSystemStats: async () => {
    const response = await client.get('/api/admin/stats');
    return response.data;
  }
};