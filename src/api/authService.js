import client from './client';

export const authService = {
  signup: async (userData) => {
    try {
      // Changed from '/api/auth/signup' to '/auth/signup'
      const response = await client.post('/auth/signup', userData);
      return response.data;
    } catch (error) {
      console.log("FRONTEND API ERROR:", error.response?.data || error.message);
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      // Changed from '/api/auth/login' to '/auth/login'
      const response = await client.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.log("FRONTEND API ERROR:", error.response?.data || error.message);
      throw error;
    }
  }
};