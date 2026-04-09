import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  ParentCompany,
  UserLoginResponse,
  UserRole,
  UserSiteOption,
} from "@/types/user";
import { LicenseSummary } from "@/types/license";
import { LoginService } from "@/services/login.service";

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 horas
const AUTH_VERSION = 6; // Incrementado para incluir licenseSummary en sesión

interface AuthState {
  user: UserLoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorAuth: string | null;
  expiresAt: number | null; // timestamp en ms
  logoUrl: string | null; // Logo personalizado del usuario ADMIN
  // Nuevo: para selecciÃ³n de empresa padre
  selectedParentCompanyId: string | null;
  pendingParentCompanySelection: boolean; // true si necesita seleccionar empresa
  availableParentCompanies: ParentCompany[]; // lista de empresas disponibles
  // Nuevo: selecciÃ³n de sede para PRL
  selectedSiteId: string | null;
  pendingSiteSelection: boolean;
  availableSites: UserSiteOption[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  setSelectedParentCompany: (companyId: string) => void;
  setAvailableParentCompanies: (companies: ParentCompany[]) => void;
  setPendingParentCompanySelection: (pending: boolean) => void;
  setSelectedSite: (siteId: string) => void;
  setAvailableSites: (sites: UserSiteOption[]) => void;
  setPendingSiteSelection: (pending: boolean) => void;
  setLogoUrl: (logoUrl: string | null) => void;
  licenseSummary: LicenseSummary | null;
}

const initialState: Omit<
  AuthState,
  | "login"
  | "logout"
  | "clearError"
  | "setSelectedParentCompany"
  | "setAvailableParentCompanies"
  | "setPendingParentCompanySelection"
  | "setSelectedSite"
  | "setAvailableSites"
  | "setPendingSiteSelection"
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
  selectedSiteId: null,
  pendingSiteSelection: false,
  availableSites: [],
  licenseSummary: null,
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

            // Admin no tiene companyId, no necesita selecciÃ³n de empresa padre
            const isAdmin =
              userData.role === UserRole.Admin ||
              userData.role === UserRole.SuperAdmin;

            // Usar el logo del admin si viene en la respuesta del login
            const logoUrl: string | null = userData.adminLogoUrl || null;
            const licenseSummary = userData.licenseSummary ?? null;

            if (isAdmin) {
              // Admin: login directo sin selecciÃ³n de empresa
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl,
                licenseSummary,
                selectedParentCompanyId: null,
                pendingParentCompanySelection: false,
                selectedSiteId: null,
                pendingSiteSelection: false,
                availableSites: [],
              });
            } else if (userData.role === UserRole.PRLManager) {
              // PRL: requiere seleccionar sede si tiene mÃ¡s de una
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl,
                licenseSummary,
                pendingParentCompanySelection: false,
                selectedParentCompanyId: userData.parentCompanyId || null,
                pendingSiteSelection: true,
                selectedSiteId: null,
                availableSites: [],
              });
            } else if (userData.parentCompanyId) {
              // Company con parentCompanyId definido: usarlo directamente
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl,
                licenseSummary,
                selectedParentCompanyId: userData.parentCompanyId,
                pendingParentCompanySelection: false,
                selectedSiteId: null,
                pendingSiteSelection: false,
                availableSites: [],
              });
            } else {
              // Company sin parentCompanyId: necesita seleccionar empresa
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt: now + SESSION_DURATION_MS,
                logoUrl,
                licenseSummary,
                pendingParentCompanySelection: true,
                selectedParentCompanyId: null,
                selectedSiteId: null,
                pendingSiteSelection: false,
                availableSites: [],
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
      setSelectedSite: (siteId: string) => {
        set({
          selectedSiteId: siteId,
          pendingSiteSelection: false,
        });
      },
      setAvailableSites: (sites: UserSiteOption[]) => {
        set({ availableSites: sites });
      },
      setPendingSiteSelection: (pending: boolean) => {
        set({ pendingSiteSelection: pending });
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
        logoUrl: state.logoUrl,
        selectedParentCompanyId: state.selectedParentCompanyId,
        selectedSiteId: state.selectedSiteId,
        licenseSummary: state.licenseSummary,
      }),
    },
  ),
);

