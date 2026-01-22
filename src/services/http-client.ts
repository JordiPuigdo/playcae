import { ApiResponse } from "@/interfaces/api-response";

export class HttpClient {
  constructor(private readonly baseUrl: string = "") {}

  async get<T>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`);
    return this.handleResponse<T>(response);
  }

  async post<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async upload<T>(url: string, formData: FormData): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "POST",
      body: formData,
    });
    return this.handleResponse<T>(response);
  }

  async put<T = void>(url: string, body: unknown): Promise<ApiResponse<T>> {
    // Si body es FormData, no agregar Content-Type header
    const isFormData = body instanceof FormData;

    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "PUT",
      headers: isFormData
        ? undefined
        : {
            "Content-Type": "application/json",
          },
      body: isFormData ? body : JSON.stringify(body),
    });
    return this.handleResponse<T>(response);
  }

  async delete<T = void>(url: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.baseUrl}${url}`, {
      method: "DELETE",
    });
    return this.handleResponse<T>(response);
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
