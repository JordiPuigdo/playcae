import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserLoginResponse } from "@/types/user";
import { LoginService } from "@/services/login.service";

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const AUTH_VERSION = 2;

interface AuthState {
  user: UserLoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorAuth: string | null;
  expiresAt: number | null; // timestamp en ms
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const initialState: Omit<AuthState, "login" | "logout" | "clearError"> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  errorAuth: null,
  expiresAt: null,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      login: async (email: string, password: string) => {
        set({ isLoading: true, errorAuth: null });
        try {
          const loginService = new LoginService();
          const response = await loginService.login(email, password);

          if (response?.data) {
            const now = Date.now();
            set({
              user: response.data,
              // token: response.data.token ?? null, // si viene del backend
              isAuthenticated: true,
              isLoading: false,
              expiresAt: now + SESSION_DURATION_MS,
            });
          } else {
            set({
              errorAuth: "Invalid credentials or server error",
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            errorAuth: "Credenciales incorrectas",
            isLoading: false,
          });
        }
      },
      logout: () => {
        set({
          ...initialState,
        });
      },
      clearError: () => {
        set({ errorAuth: null });
      },
    }),
    {
      name: "auth-storage",
      version: AUTH_VERSION,
      migrate: (persistedState: any, version) => {
        if (version < AUTH_VERSION) {
          return {
            ...initialState,
          };
        }
        return persistedState as AuthState;
      },
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        expiresAt: state.expiresAt, // <--- importante persistirlo
      }),
    }
  )
);
