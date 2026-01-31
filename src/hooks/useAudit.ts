"use client";

import { useState, useCallback } from "react";
import { AuditLog, DocumentNotification, EmailRegistry } from "@/types/audit";
import { AdminAuditService, AuditLogsParams } from "@/services/audit.service";
import { HttpClient } from "@/services/http-client";
import { ApiError } from "@/interfaces/api-response";
import { useAuthStore } from "@/hooks/useAuthStore";

interface UseAuditReturn {
  // Data
  auditLogs: AuditLog[];
  documentNotifications: DocumentNotification[];
  emailRegistry: EmailRegistry[];
  
  // Loading states
  isLoadingAuditLogs: boolean;
  isLoadingNotifications: boolean;
  isLoadingEmails: boolean;
  
  // Error states
  auditLogsError: ApiError | null;
  notificationsError: ApiError | null;
  emailsError: ApiError | null;
  
  // Actions
  fetchAuditLogs: (params?: AuditLogsParams) => Promise<void>;
  fetchDocumentNotifications: (params?: AuditLogsParams) => Promise<void>;
  fetchEmailRegistry: (params?: AuditLogsParams) => Promise<void>;
  fetchAll: (params?: AuditLogsParams) => Promise<void>;
  
  // Date range
  dateRange: { from: string; to: string };
  setDateRange: (from: string, to: string) => void;
}

export const useAudit = (): UseAuditReturn => {
  const auditService = new AdminAuditService(new HttpClient());
  const user = useAuthStore((s) => s.user);
  const userId = user?.userId;

  // Data states
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [documentNotifications, setDocumentNotifications] = useState<DocumentNotification[]>([]);
  const [emailRegistry, setEmailRegistry] = useState<EmailRegistry[]>([]);

  // Loading states
  const [isLoadingAuditLogs, setIsLoadingAuditLogs] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isLoadingEmails, setIsLoadingEmails] = useState(false);

  // Error states
  const [auditLogsError, setAuditLogsError] = useState<ApiError | null>(null);
  const [notificationsError, setNotificationsError] = useState<ApiError | null>(null);
  const [emailsError, setEmailsError] = useState<ApiError | null>(null);

  // Date range - default to last 30 days
  const getDefaultDateRange = () => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - 30);
    
    return {
      from: from.toISOString().split("T")[0],
      to: to.toISOString().split("T")[0],
    };
  };

  const [dateRange, setDateRangeState] = useState(getDefaultDateRange());

  const setDateRange = useCallback((from: string, to: string) => {
    setDateRangeState({ from, to });
  }, []);

  const handleError = (err: unknown): ApiError => {
    const error = err as ApiError;
    return error;
  };

  const fetchAuditLogs = useCallback(async (params?: AuditLogsParams) => {
    setIsLoadingAuditLogs(true);
    setAuditLogsError(null);
    
    try {
      const queryParams: AuditLogsParams = {
        from: params?.from || dateRange.from,
        to: params?.to || dateRange.to,
        userId: params?.userId || userId,
      };
      const response = await auditService.getAuditLogs(queryParams);
      setAuditLogs(response.data || []);
    } catch (err) {
      const error = handleError(err);
      setAuditLogsError(error);
      setAuditLogs([]);
    } finally {
      setIsLoadingAuditLogs(false);
    }
  }, [dateRange, userId]);

  const fetchDocumentNotifications = useCallback(async (params?: AuditLogsParams) => {
    setIsLoadingNotifications(true);
    setNotificationsError(null);
    
    try {
      const queryParams: AuditLogsParams = {
        from: params?.from || dateRange.from,
        to: params?.to || dateRange.to,
        userId: params?.userId || userId,
      };
      const response = await auditService.getDocumentNotifications(queryParams);
      setDocumentNotifications(response.data || []);
    } catch (err) {
      const error = handleError(err);
      setNotificationsError(error);
      setDocumentNotifications([]);
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [dateRange, userId]);

  const fetchEmailRegistry = useCallback(async (params?: AuditLogsParams) => {
    setIsLoadingEmails(true);
    setEmailsError(null);
    
    try {
      const queryParams: AuditLogsParams = {
        from: params?.from || dateRange.from,
        to: params?.to || dateRange.to,
        // Email registry no necesita userId según la API
      };
      const response = await auditService.getEmailRegistry(queryParams);
      setEmailRegistry(response.data || []);
    } catch (err) {
      const error = handleError(err);
      setEmailsError(error);
      setEmailRegistry([]);
    } finally {
      setIsLoadingEmails(false);
    }
  }, [dateRange]);

  const fetchAll = useCallback(async (params?: AuditLogsParams) => {
    const queryParams: AuditLogsParams = {
      from: params?.from || dateRange.from,
      to: params?.to || dateRange.to,
      userId: params?.userId || userId,
    };
    
    await Promise.all([
      fetchAuditLogs(queryParams),
      fetchDocumentNotifications(queryParams),
      fetchEmailRegistry({ from: queryParams.from, to: queryParams.to }),
    ]);
  }, [dateRange, userId, fetchAuditLogs, fetchDocumentNotifications, fetchEmailRegistry]);

  return {
    // Data
    auditLogs,
    documentNotifications,
    emailRegistry,
    
    // Loading states
    isLoadingAuditLogs,
    isLoadingNotifications,
    isLoadingEmails,
    
    // Error states
    auditLogsError,
    notificationsError,
    emailsError,
    
    // Actions
    fetchAuditLogs,
    fetchDocumentNotifications,
    fetchEmailRegistry,
    fetchAll,
    
    // Date range
    dateRange,
    setDateRange,
  };
};
