import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  role: null, // 'customer', 'chef', 'admin'
  isAuthenticated: false,

  setUser: (user, token) => set({ 
    user, 
    token, 
    role: user.role, 
    isAuthenticated: true 
  }),

  logout: () => set({ 
    user: null, 
    token: null, 
    role: null, 
    isAuthenticated: false 
  }),
}));

export default useAuthStore;