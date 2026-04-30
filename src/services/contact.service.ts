import { ApiResponse } from "@/interfaces/api-response";
import { HttpClient } from "./http-client";

export interface ContactFormPayload {
  name: string;
  email: string;
  message: string;
}

export interface IContactService {
  send(payload: ContactFormPayload): Promise<ApiResponse<void>>;
}

export class ContactService implements IContactService {
  private readonly httpClient = new HttpClient();

  private readonly baseUrl = "/api/contact";

  async send(payload: ContactFormPayload): Promise<ApiResponse<void>> {
    return this.httpClient.post<void>(this.baseUrl, payload);
  }
}
