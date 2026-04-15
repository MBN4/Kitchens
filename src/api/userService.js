import client from './client';

export const userService = {
  updateProfile: async (data) => {
    const response = await client.put('/api/auth/profile', data);
    return response.data;
  },
  savePushToken: async (token) => {
    const response = await client.put('/api/auth/profile', { push_token: token });
    return response.data;
  }
};