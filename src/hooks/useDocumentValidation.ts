import { useState, useCallback } from "react";
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
  expiryDate: string;
  comment: string;
  isValidStatusForValidation: boolean;
  isModifying: boolean;
  canSubmit: boolean;
  openDialog: () => void;
  closeDialog: () => void;
  setIsValidating: (value: boolean) => void;
  setExpiryDate: (date: string) => void;
  setComment: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  resetForm: () => void;
}

const VALID_STATUSES_FOR_VALIDATION: EntityStatus[] = [
  EntityStatus.Rejected,
  EntityStatus.Expired,
  EntityStatus.PendingManualy,
  EntityStatus.ExpiredByAI,
];

const ALREADY_VALIDATED_STATUSES: EntityStatus[] = [
  EntityStatus.Approved,
  EntityStatus.ValidatedByAI,
];

export const useDocumentValidation = ({
  document,
  onValidate,
  onSuccess,
}: UseDocumentValidationProps): UseDocumentValidationReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidating, setIsValidating] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expiryDate, setExpiryDate] = useState("");
  const [comment, setComment] = useState("");

  const isModifying = ALREADY_VALIDATED_STATUSES.includes(document.status);

  const isValidStatusForValidation =
    VALID_STATUSES_FOR_VALIDATION.includes(document.status) || isModifying;

  const canSubmit = isValidating !== null;

  const resetForm = useCallback(() => {
    setIsValidating(null);
    setExpiryDate("");
    setComment("");
  }, []);

  const openDialog = useCallback(() => {
    if (!isValidStatusForValidation) return;
    if (document.expirationDate) {
      // expirationDate may come as ISO string; take only the date part
      setExpiryDate(document.expirationDate.slice(0, 10));
    }
    setIsOpen(true);
  }, [isValidStatusForValidation, document.expirationDate]);

  const closeDialog = useCallback(() => {
    setIsOpen(false);
    resetForm();
  }, [resetForm]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (isValidating === null) return;

      setIsLoading(true);
      try {
        await onValidate(isValidating, comment || undefined, expiryDate || undefined);
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

  const handleSetExpiryDate = useCallback((date: string) => {
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
    isModifying,
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
