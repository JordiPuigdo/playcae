import { useState, useCallback } from "react";
import dayjs from "dayjs";
import { Document, EntityStatus } from "@/types/document";

interface UseDocumentValidationProps {
  document: Document;
  onValidate: (
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => void | Promise<void>;
  onSuccess?: () => void;
}

interface UseDocumentValidationReturn {
  isOpen: boolean;
  isValidating: boolean | null;
  isLoading: boolean;
  expiryDate: Date | null;
  comment: string;
  isValidStatusForValidation: boolean;
  canSubmit: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsValidating: (value: boolean) => void;
  setExpiryDate: (date: Date | null) => void;
  setComment: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const VALID_STATUSES_FOR_VALIDATION: EntityStatus[] = [
  EntityStatus.Rejected,
  EntityStatus.Expired,
  EntityStatus.PendingManualy,
  EntityStatus.ExpiredByAI,
  EntityStatus.Pending,
];

export const useDocumentValidation = ({
  document,
  onValidate,
  onSuccess,
}: UseDocumentValidationProps): UseDocumentValidationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);
  const [comment, setComment] = useState("");

  const isValidStatusForValidation = VALID_STATUSES_FOR_VALIDATION.includes(
    document.status
  );

  const canSubmit = isValidating !== null;

  const resetForm = useCallback(() => {
    setIsValidating(null);
    setExpiryDate(null);
    setComment("");
  }, []);

  const openDialog = useCallback(() => {
    if (!isValidStatusForValidation) return;
    setIsOpen(true);
  }, [isValidStatusForValidation]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isValidating === null) return;

      const formattedDate = expiryDate
        ? dayjs(expiryDate).format("YYYY-MM-DD")
        : undefined;

      setIsLoading(true);
      try {
        await onValidate(isValidating, comment || undefined, formattedDate);
        closeDialog();
        onSuccess?.();
      } catch (error) {
        console.error("Error al validar documento:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isValidating, expiryDate, comment, onValidate, closeDialog, onSuccess]
  );

  const handleSetIsValidating = useCallback((value: boolean) => {
    setIsValidating(value);
  }, []);

  const handleSetExpiryDate = useCallback((date: Date | null) => {
    setExpiryDate(date);
  }, []);

  const handleSetComment = useCallback((value: string) => {
    setComment(value);
  }, []);

  return {
    isOpen,
    isValidating,
    isLoading,
    expiryDate,
    comment,
    isValidStatusForValidation,
    canSubmit,
    openDialog,
    closeDialog,
    setIsValidating: handleSetIsValidating,
    setExpiryDate: handleSetExpiryDate,
    setComment: handleSetComment,
    handleSubmit,
    resetForm,
  };
};
