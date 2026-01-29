import { useState } from "react";
import { UserConfiguration } from "@/types/userConfiguration";
import { UserConfigurationService } from "@/services/user-configuration.service";
import { useToast } from "./use-Toast";
import { useAuthStore } from "./useAuthStore";

const userConfigurationService = new UserConfigurationService();

export const useUserConfiguration = () => {
  const [configuration, setConfiguration] = useState<UserConfiguration | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { setLogoUrl } = useAuthStore();

  const loadConfiguration = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await userConfigurationService.getByUserId(userId);

      if (response.status === 200 && response.data) {
        setConfiguration(response.data);
        return response.data;
      } else {
        setConfiguration(null);
      }
    } catch (err) {
      console.error("Error al cargar configuración:", err);
      setError("Error al cargar la configuración");
      setConfiguration(null);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadLogo = async (userId: string, file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userConfigurationService.uploadLogo(userId, file);

      if (response.status === 200 && response.data) {
        setConfiguration(response.data);
        // Actualizar el logo en el store global
        setLogoUrl(response.data.logoUrl);
        toast({
          title: "Logo subido correctamente",
          description: "El logo se ha actualizado exitosamente",
          variant: "default",
        });
        return response.data;
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Error al subir el logo";
      setError(errorMsg);
      toast({
        title: "Error al subir logo",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateLogo = async (userId: string, file: File) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await userConfigurationService.updateLogo(userId, file);

      if (response.status === 200 && response.data) {
        setConfiguration(response.data);
        // Actualizar el logo en el store global
        setLogoUrl(response.data.logoUrl);
        toast({
          title: "Logo actualizado correctamente",
          description: "El logo se ha actualizado exitosamente",
          variant: "default",
        });
        return response.data;
      }
    } catch (err: any) {
      const errorMsg = err?.message || "Error al actualizar el logo";
      setError(errorMsg);
      toast({
        title: "Error al actualizar logo",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLogo = async (userId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      await userConfigurationService.deleteLogo(userId);

      if (configuration) {
        setConfiguration({ ...configuration, logoUrl: null });
      }

      // Actualizar el logo en el store global (null = usar logo por defecto)
      setLogoUrl(null);

      toast({
        title: "Logo eliminado",
        description: "El logo se ha eliminado correctamente",
        variant: "default",
      });
    } catch (err: any) {
      const errorMsg = err?.message || "Error al eliminar el logo";
      setError(errorMsg);
      toast({
        title: "Error al eliminar logo",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getLogoUrl = async (userId: string): Promise<string> => {
    const data = await userConfigurationService.getLogoUrl(userId);
    return data.data.url || "";
  }

  return {
    configuration,
    isLoading,
    error,
    loadConfiguration,
    uploadLogo,
    updateLogo,
    deleteLogo,
    getLogoUrl,
  };
};
