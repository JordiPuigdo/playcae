import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/TextArea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { Calendar, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Document } from "@/types/document";
import { Label } from "./ui/Label";
import { DatePicker } from "./ui/DatePicker";
import { useDocumentValidation } from "@/hooks/useDocumentValidation";
import { useTranslation } from "@/hooks/useTranslation";

interface DocumentValidationProps {
  documentName: string;
  onValidate: (
    isValid: boolean,
    comment?: string,
    expiryDate?: string
  ) => void | Promise<void>;
  canValidate: boolean;
  document: Document;
  onSuccess?: () => void;
}

export const DocumentValidation = ({
  documentName,
  onValidate,
  canValidate,
  document,
  onSuccess,
}: DocumentValidationProps) => {
  const { t } = useTranslation();

  const {
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
    setIsValidating,
    setExpiryDate,
    setComment,
    handleSubmit,
  } = useDocumentValidation({
    document,
    onValidate,
    onSuccess,
  });

  if (!canValidate) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!isValidStatusForValidation) return;
        if (open) {
          openDialog();
        } else {
          closeDialog();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-playBlueLight text-brand-primary hover:bg-playGrey ${
            isValidStatusForValidation ? "" : "opacity-50 cursor-not-allowed"
          }`}
          disabled={!isValidStatusForValidation}
        >
          <CheckCircle className="h-4 w-4 text-brand-primary" />
          {isModifying
            ? t("documents.validation.modifyButton")
            : t("documents.validation.validateButton")}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-white border border-playBlueLight/30">
        <DialogHeader>
          <DialogTitle className="text-brand-primary">
            {isModifying
              ? t("documents.validation.modifyTitle", { name: documentName })
              : t("documents.validation.validateTitle", { name: documentName })}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="space-y-2">
              <Label
                htmlFor="expiryDate"
                className="flex items-center gap-2 text-brand-primary"
              >
                <Calendar className="h-4 w-4 text-brand-primary" />
                {t("documents.validation.expiryDateLabel")}
              </Label>
              <DatePicker
                id="expiryDate"
                value={expiryDate}
                onChange={setExpiryDate}
                placeholder={t("documents.validation.expiryDatePlaceholder")}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>

            <div className="text-sm font-medium text-brand-primary">
              {t("documents.validation.validationResult")}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant={isValidating === true ? "default" : "outline"}
                className={`flex-1 gap-2 ${
                  isValidating === true
                    ? "bg-playGreen hover:bg-playGreen/90 text-white"
                    : "border-playBlueLight text-brand-primary hover:bg-playGrey"
                }`}
                onClick={() => setIsValidating(true)}
              >
                <CheckCircle className="h-4 w-4" />
                {t("documents.validation.validateButton")}
              </Button>

              <Button
                type="button"
                variant={isValidating === false ? "destructive" : "outline"}
                className={`flex-1 gap-2 ${
                  isValidating === false
                    ? "bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                    : "border-playBlueLight text-brand-primary hover:bg-playGrey"
                }`}
                onClick={() => setIsValidating(false)}
              >
                <XCircle className="h-4 w-4" />
                {t("documents.validation.rejectButton")}
              </Button>
            </div>
          </div>

          {isValidating !== null && (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-brand-primary">
                {isValidating ? t("documents.validation.commentOptional") : t("documents.validation.rejectionReason")}
              </Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  isValidating
                    ? t("documents.validation.commentPlaceholder")
                    : t("documents.validation.rejectionPlaceholder")
                }
                required={!isValidating}
                className="border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={closeDialog}
              className="border-playBlueLight text-brand-primary hover:bg-playGrey"
            >
              {t("documents.validation.cancel")}
            </Button>

            <Button
              type="submit"
              disabled={!canSubmit || isLoading}
              className={`${
                isValidating === false
                  ? "bg-brand-secondary hover:bg-brand-secondary/90 text-white"
                  : "bg-playGreen hover:bg-playGreen/90 text-white"
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t("documents.validation.processing")}
                </>
              ) : isValidating ? (
                isModifying
                  ? t("documents.validation.modifyDocument")
                  : t("documents.validation.validateDocument")
              ) : (
                t("documents.validation.rejectDocument")
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
