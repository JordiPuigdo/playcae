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

const AUTH_VERSION = 9;

interface AuthState {
  user: UserLoginResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  errorAuth: string | null;
  expiresAt: number | null; // timestamp en ms — ahora refleja expiración del refresh token (~1 año)
  logoUrl: string | null;
  selectedParentCompanyId: string | null;
  pendingParentCompanySelection: boolean;
  availableParentCompanies: ParentCompany[];
  selectedSiteId: string | null;
  pendingSiteSelection: boolean;
  availableSites: UserSiteOption[];
  licenseSummary: LicenseSummary | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshSession: () => Promise<boolean>;
  clearError: () => void;
  setSelectedParentCompany: (companyId: string) => void;
  setAvailableParentCompanies: (companies: ParentCompany[]) => void;
  setPendingParentCompanySelection: (pending: boolean) => void;
  setSelectedSite: (siteId: string) => void;
  setAvailableSites: (sites: UserSiteOption[]) => void;
  setPendingSiteSelection: (pending: boolean) => void;
  setLogoUrl: (logoUrl: string | null) => void;
}

const initialState: Omit<
  AuthState,
  | "login"
  | "logout"
  | "refreshSession"
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

function calcExpiresAt(refreshTokenExpiryTime?: string): number {
  if (refreshTokenExpiryTime) {
    const parsed = new Date(refreshTokenExpiryTime).getTime();
    if (!isNaN(parsed)) return parsed;
  }
  return Date.now() + 365 * 24 * 60 * 60 * 1000;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...initialState,
      login: async (email: string, password: string) => {
        set({ isLoading: true, errorAuth: null });
        try {
          const loginService = new LoginService();
          const response = await loginService.login(email, password);

          if (response?.data) {
            const userData = response.data;

            const isAdmin =
              userData.role === UserRole.Admin ||
              userData.role === UserRole.SuperAdmin;

            const logoUrl: string | null = userData.adminLogoUrl || null;
            const licenseSummary = userData.licenseSummary ?? null;
            const expiresAt = calcExpiresAt(userData.refreshTokenExpiryTime);

            if (isAdmin) {
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt,
                logoUrl,
                licenseSummary,
                selectedParentCompanyId: null,
                pendingParentCompanySelection: false,
                selectedSiteId: null,
                pendingSiteSelection: false,
                availableSites: [],
              });
            } else if (userData.role === UserRole.PRLManager) {
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt,
                logoUrl,
                licenseSummary,
                pendingParentCompanySelection: false,
                selectedParentCompanyId: userData.parentCompanyId || null,
                pendingSiteSelection: true,
                selectedSiteId: null,
                availableSites: [],
              });
            } else if (userData.parentCompanyId) {
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt,
                logoUrl,
                licenseSummary,
                selectedParentCompanyId: userData.parentCompanyId,
                pendingParentCompanySelection: false,
                selectedSiteId: null,
                pendingSiteSelection: false,
                availableSites: [],
              });
            } else {
              set({
                user: userData,
                token: userData.token || null,
                isAuthenticated: true,
                isLoading: false,
                expiresAt,
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
        } catch {
          set({
            errorAuth: "Credenciales incorrectas",
            isLoading: false,
          });
        }
      },
      logout: () => {
        if (typeof window !== "undefined") {
          fetch(`${process.env.NEXT_PUBLIC_PLAYCAE_API}/api/auth/logout-refresh`, {
            method: "POST",
            credentials: "include",
          }).catch(() => {});
        }
        set({ ...initialState });
      },
      refreshSession: async () => {
        try {
          const { RefreshService } = await import("@/services/refresh.service");
          const service = new RefreshService();
          const response = await service.refresh();
          if (response?.data) {
            set({
              token: response.data.accessToken,
              expiresAt: new Date(response.data.refreshTokenExpiryTime).getTime(),
            });
            return true;
          }
          return false;
        } catch {
          return false;
        }
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
      migrate: (persistedState: unknown, version) => {
        if (version < AUTH_VERSION) {
          return { ...initialState };
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
