import client from './client';

export const chefService = {
  addFoodItem: async (foodData) => {
    const response = await client.post('/food-items', foodData);
    return response.data;
  },
  getChefMenu: async (chefId) => {
    const response = await client.get(`/food-items?chef_id=${chefId}`);
    return response.data;
  },
  deleteFoodItem: async (itemId) => {
    const response = await client.delete(`/food-items/${itemId}`);
    return response.data;
  }
};