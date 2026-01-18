import { create } from 'zustand';
import { loginApi } from '../api/authApi';
import toast from 'react-hot-toast';

interface AuthStore {
  isAuthenticated: boolean;
  user: { id: string; email: string, role:string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => boolean;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  user: null,

  login: async (email, password) => {
    // Import toast here to avoid potential SSR/serialization issues with Zustand
    try {
      const data = await loginApi({ email, password });

      // Assuming data has: { user: { id, email, role }, token }
      const authUser = {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        token: data.token,
      };

      set({
        isAuthenticated: true,
        user: { id: data.user.id, email: data.user.email, role: data.user.role },
      });
      localStorage.setItem('authUser', JSON.stringify(authUser));
      toast.success('Login successful!');
    } catch (error) {
      toast.error('Invalid email or password');
      throw new Error('Invalid credentials');
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    localStorage.removeItem('authUser');
    toast.success('Logged out successfully!');
  },

  checkAuth: () => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      const user = JSON.parse(stored);
      set({ isAuthenticated: true, user });
      return true;
    }
    set({ isAuthenticated: false, user: null });
    return false;
  },
}));
