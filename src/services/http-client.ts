import { ApiResponse } from "@/interfaces/api-response";

let refreshPromise: Promise<boolean> | null = null;

type PersistedAuthState = {
  state?: {
    token?: string | null;
  };
};

export class HttpClient {
  constructor(
    private readonly baseUrl: string = "",
    private readonly skipRefresh: boolean = false
  ) {}

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const doRequest = () =>
      fetch(`${this.baseUrl}${url}`, {
        headers: this.buildHeaders(),
        credentials: "include",
      });
    const response = await doRequest();
    return this.handleResponse<T>(response, doRequest);
  }

  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const doRequest = () =>
      fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        headers: this.buildHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(body),
        credentials: "include",
      });
    const response = await doRequest();
    return this.handleResponse<T>(response, doRequest);
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const doRequest = () =>
      fetch(`${this.baseUrl}${url}`, {
        method: "POST",
        headers: this.buildHeaders(),
        body: formData,
        credentials: "include",
      });
    const response = await doRequest();
    return this.handleResponse<T>(response, doRequest);
  }

  async put<T = void>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;
    const doRequest = () =>
      fetch(`${this.baseUrl}${url}`, {
        method: "PUT",
        headers: isFormData
          ? this.buildHeaders()
          : this.buildHeaders({ "Content-Type": "application/json" }),
        body: isFormData ? body : JSON.stringify(body),
        credentials: "include",
      });
    const response = await doRequest();
    return this.handleResponse<T>(response, doRequest);
  }

  async delete<T = void>(url: string): Promise<ApiResponse<T>> {
    const doRequest = () =>
      fetch(`${this.baseUrl}${url}`, {
        method: "DELETE",
        headers: this.buildHeaders(),
        credentials: "include",
      });
    const response = await doRequest();
    return this.handleResponse<T>(response, doRequest);
  }

  private buildHeaders(extraHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = { ...(extraHeaders || {}) };
    const token = this.getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = window.localStorage.getItem("auth-storage");
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PersistedAuthState;
      return parsed.state?.token || null;
    } catch {
      return null;
    }
  }

  private async handleResponse<T>(
    response: Response,
    retryFn?: () => Promise<Response>
  ): Promise<ApiResponse<T>> {
    if (response.status === 401 && retryFn && !this.skipRefresh) {
      const { useAuthStore } = await import("@/hooks/useAuthStore");
      const store = useAuthStore.getState();
      refreshPromise ??= store.refreshSession().finally(() => {
        refreshPromise = null;
      });
      const refreshed = await refreshPromise;
      if (refreshed) {
        const retried = await retryFn();
        return this.handleResponse<T>(retried);
      } else {
        store.logout();
        throw { status: 401, message: "Session expired" };
      }
    }

    if (!response.ok) {
      let message = "Error de servidor";
      try {
        const text = await response.text();
        if (text) {
          try {
            const body = JSON.parse(text);
            if (typeof body === "string") {
              message = body;
            } else if (body?.message) {
              message = body.message;
            } else if (body?.title) {
              message = body.title;
            }
          } catch {
            message = text;
          }
        }
      } catch {
        /* ignore */
      }
      throw { status: response.status, message };
    }

    const data = await response.json().catch(() => null);
    return { status: response.status, data };
  }
}
