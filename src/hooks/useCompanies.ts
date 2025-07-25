import { useMemo } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { Company, CompanyFormData } from "@/types/company";
import { CompanyService } from "@/services/companies.service";
import { HttpClient } from "@/services/http-client";
import { ApiError, ApiResponse } from "@/interfaces/api-response";
import { EntityStatus } from "@/types/document";
import { useAuthStore } from "./useAuthStore";

const COMPANIES_KEY = "/api/companies";

export const useCompanies = () => {
  const companyService = new CompanyService(new HttpClient());
  const { user } = useAuthStore();
  const {
    data: companies = [],
    mutate,
    error: swrError,
    isValidating,
  } = useSWR<Company[]>(
    COMPANIES_KEY,
    async () => {
      const response = await companyService.getAll();
      return response.data;
    },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    }
  );

  const handleError = (err: unknown): ApiError => {
    const error = err as ApiError;
    return error;
  };

  const getCompanyById = async (id: string): Promise<Company | null> => {
    try {
      const response = await companyService.getById(id);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    }
  };

  const createCompany = async (data: CompanyFormData): Promise<Company> => {
    try {
      const newCompany: Company = {
        ...data,
        status: EntityStatus.Pending,
        userId: user!.userId!,
      };

      const response = await companyService.create(newCompany);
      mutate([...companies, response.data]);

      return response.data;
    } catch (err) {
      mutate(companies, false);
      throw handleError(err);
    }
  };

  const updateCompany = async (
    id: string,
    company: Partial<CompanyFormData>
  ): Promise<Company> => {
    try {
      const response = await companyService.update(id, company);
      return response.data;
    } catch (err) {
      mutate(companies, false);
      throw handleError(err);
    }
  };

  const updateCompanyStatus = async (
    id: string,
    status: EntityStatus
  ): Promise<void> => {
    try {
      const optimisticData = companies.map((c) =>
        c.id === id ? { ...c, status } : c
      );
      mutate(optimisticData, false);

      await companyService.updateStatus(id, status);

      mutate();
    } catch (err) {
      mutate(companies, false);
      throw handleError(err);
    }
  };

  const refreshCompanies = async () => {
    await mutate();
  };

  const filteredCompanies = useMemo(() => {
    return (search: string, status: Company["status"] | "Todos") => {
      return companies.filter((company) => {
        const matchesSearch =
          search === "" ||
          company.name.toLowerCase().includes(search.toLowerCase()) ||
          company.taxId?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = status === "Todos" || company.status === status;

        return matchesSearch && matchesStatus;
      });
    };
  }, [companies]);

  return {
    companies,
    loading: isValidating,
    error: swrError,
    getCompanyById,
    createCompany,
    updateCompany,
    updateCompanyStatus,
    filteredCompanies,
    refreshCompanies,
  };
};

export const revalidateCompanies = () => {
  return globalMutate(COMPANIES_KEY);
};
