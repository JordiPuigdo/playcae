import { ApiResponse } from "@/interfaces/api-response";

type PersistedAuthState = {
  state?: {
    token?: string | null;
  };
};

export class HttpClient {
  constructor(private readonly baseUrl: string = "") {}

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.buildHeaders({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: this.buildHeaders(),
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  async put<T = void>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const isFormData = body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: isFormData
        ? this.buildHeaders()
        : this.buildHeaders({
            "Content-Type": "application/json",
          }),
      body: isFormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = void>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
      headers: this.buildHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private buildHeaders(extraHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      ...(extraHeaders || {}),
    };

    const token = this.getStoredToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  private getStoredToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const raw = window.localStorage.getItem("auth-storage");
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as PersistedAuthState;
      return parsed.state?.token || null;
    } catch {
      return null;
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: error.message || "An error occurred",
        data: error,
      };
    }

    const data = await response.json().catch(() => null);
    return {
      status: response.status,
      data,
    };
  }
}
