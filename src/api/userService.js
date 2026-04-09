import client from './client';

export const userService = {
  updateProfile: async (userId, data) => {
    const response = await client.patch(`/users/${userId}`, data);
    return response.data;
  },
  getChefStats: async (chefId) => {
    const response = await client.get(`/chefs/${chefId}/stats`);
    return response.data;
  },
  saveAddress: async (userId, addressData) => {
    const response = await client.post(`/users/${userId}/addresses`, addressData);
    return response.data;
  }
};