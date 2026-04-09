import client from './client';

export const authService = {
  signup: async (userData) => {
    try {
      console.log("SERVICE: Sending Signup Data...", userData);
      const response = await client.post('/auth/signup', userData);
      console.log("SERVICE: Response Received", response.data);
      return response.data;
    } catch (error) {
      console.log("AXIOS ERROR DETAILS:", error.response?.data || error.message);
      throw error;
    }
  },
  login: async (email, password) => {
    try {
      console.log("SERVICE: Sending Login Data...", email);
      const response = await client.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.log("AXIOS ERROR DETAILS:", error.response?.data || error.message);
      throw error;
    }
  }
};