import { create } from 'zustand';

interface User {
  email: string;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Simulated user database
const users = [
  { email: 'user@test.com', password: 'user123', isAdmin: false },
  { email: 'admin@test.com', password: 'admin123', isAdmin: true },
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (email: string, password: string) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      set({ user: { email: user.email, isAdmin: user.isAdmin } });
      return true;
    }
    return false;
  },
  logout: () => set({ user: null }),
}));