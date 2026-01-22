import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ParentCompany, UserLoginResponse, UserRole } from "@/types/user";
import { LoginService } from "@/services/login.service";
import { UserConfigurationService } from "@/services/user-configuration.service";

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const AUTH_VERSION = 3; // Incrementado para forzar migración

interface AuthState {
  user: UserLoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorAuth: string | null;
  expiresAt: number | null; // timestamp en ms
  logoUrl: string | null; // Logo personalizado del usuario ADMIN
  // Nuevo: para selección de empresa padre
  selectedParentCompanyId: string | null;
  pendingParentCompanySelection: boolean; // true si necesita seleccionar empresa
  availableParentCompanies: ParentCompany[]; // lista de empresas disponibles
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setSelectedParentCompany: (companyId: string) => void;
  setAvailableParentCompanies: (companies: ParentCompany[]) => void;
  setPendingParentCompanySelection: (pending: boolean) => void;
  setLogoUrl: (logoUrl: string | null) => void;
}

const initialState: Omit<
  AuthState,
  | "login"
  | "logout"
  | "clearError"
  | "setSelectedParentCompany"
  | "setAvailableParentCompanies"
  | "setPendingParentCompanySelection"
  | "setLogoUrl"
> = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  errorAuth: null,
  expiresAt: null,
  logoUrl: null,
  selectedParentCompanyId: null,
  pendingParentCompanySelection: false,
  availableParentCompanies: [],
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
            const userData = response.data;

            // Admin no tiene companyId, no necesita selección de empresa padre
            const isAdmin =
              userData.role === UserRole.Admin ||
              userData.role === UserRole.SuperAdmin;

            // Cargar logo del usuario si es Admin
            let logoUrl: string | null = null;
            if (userData.role === UserRole.Admin) {
              try {
                const configService = new UserConfigurationService();
                const configResponse = await configService.getByUserId(
                  userData.userId,
                );
                if (configResponse?.data?.logoUrl) {
                  logoUrl = configResponse.data.logoUrl;
                }
              } catch (err) {
                // Si no hay configuración o falla, continuar sin logo
                console.log("No se pudo cargar la configuración del usuario");
              }
            }

            if (isAdmin) {
              // Admin: login directo sin selección de empresa
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl,
                selectedParentCompanyId: null,
                pendingParentCompanySelection: false,
              });
            } else if (userData.parentCompanyId) {
              // Company con parentCompanyId definido: usarlo directamente
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl: null,
                selectedParentCompanyId: userData.parentCompanyId,
                pendingParentCompanySelection: false,
              });
            } else {
              // Company sin parentCompanyId: necesita seleccionar empresa
              set({
                user: userData,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl: null,
                pendingParentCompanySelection: true,
                selectedParentCompanyId: null,
              });
            }
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
      setSelectedParentCompany: (companyId: string) => {
        set({
          selectedParentCompanyId: companyId,
          pendingParentCompanySelection: false,
        });
      },
      setAvailableParentCompanies: (companies: ParentCompany[]) => {
        set({ availableParentCompanies: companies });
      },
      setPendingParentCompanySelection: (pending: boolean) => {
        set({ pendingParentCompanySelection: pending });
      },
      setLogoUrl: (logoUrl: string | null) => {
        set({ logoUrl });
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
        expiresAt: state.expiresAt,
        logoUrl: state.logoUrl, // Persistir logo URL
        selectedParentCompanyId: state.selectedParentCompanyId, // Persistir selección
      }),
    },
  ),
);
