import client from './client';

export const customerService = {
  getVerifiedChefs: async () => {
    const response = await client.get('/chefs/active');
    return response.data;
  },
  getChefMenu: async (chefId) => {
    const response = await client.get(`/chefs/menu/${chefId}`);
    return response.data;
  }
};