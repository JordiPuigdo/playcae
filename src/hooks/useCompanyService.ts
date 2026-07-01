import { useMemo } from "react";
import { CompanyService } from "@/services/companies.service";
import { HttpClient } from "@/services/http-client";

export const useCompanyService = () =>
  useMemo(() => new CompanyService(new HttpClient()), []);
