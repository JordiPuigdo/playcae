import { HttpClient } from "./http-client";
import {
  LicenseSummary,
  TenantLicenseAdmin,
  UpdateTenantLicenseDto,
} from "@/types/license";

const client = new HttpClient(process.env.NEXT_PUBLIC_PLAYCAE_API);

export const LicenseService = {
  getSummary: () =>
    client.get<LicenseSummary>("/api/license/summary"),

  // SuperAdmin only
  getAllTenants: () =>
    client.get<TenantLicenseAdmin[]>("/api/license/admin/tenants"),

  updateTenantLicense: (adminUserId: string, dto: UpdateTenantLicenseDto) =>
    client.put<void>(`/api/license/admin/${adminUserId}`, dto),
};
