import { useMemo, useState, useCallback } from "react";
import { LeadService } from "@/services/lead.service";
import { CreateLeadRequest, Lead, LeadOrigin } from "@/types/lead";

interface UseLeadReturn {
  isLoading: boolean;
  error: string | null;
  createLead: (request: CreateLeadRequest) => Promise<Lead | null>;
}

export const useLead = (): UseLeadReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leadService = useMemo(() => new LeadService(), []);

  const createLead = useCallback(
    async (request: CreateLeadRequest): Promise<Lead | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await leadService.create(request);

        if (response.status === 201 || response.status === 200) {
          return response.data;
        }

        throw new Error("Error al crear el lead");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [leadService]
  );

  return {
    isLoading,
    error,
    createLead,
  };
};

export { LeadOrigin };
