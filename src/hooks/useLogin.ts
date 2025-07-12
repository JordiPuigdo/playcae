import { create } from 'zustand';

interface User {
  email: string;
  role: 'admin' | 'subcontractor';
}

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useLogin = create<AuthState>((set) => ({
  user: null,
  token: null,

  login: async (email, password) => {
    if (email === 'admin@root.com' && password === 'admin') {
      const user = { email, role: 'admin' as const };
      localStorage.setItem('token', 'dummy-token');
      set({ user, token: 'dummy-token' });
      return true;
    }

    if (email === 'user@sub.com' && password === '1234') {
      const user = { email, role: 'subcontractor' as const };
      localStorage.setItem('token', 'dummy-token-sub');
      set({ user, token: 'dummy-token-sub' });
      return true;
    }

    return false;
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));
