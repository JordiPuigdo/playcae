"use client";

import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Building2, Check, Loader2 } from "lucide-react";

export interface CompanyChoiceOption {
  id: string;
  name: string;
  detail?: string | null;
  badge?: string | null;
}

interface CompanyChoiceSelectorProps {
  title: string;
  description: string;
  loadingText: string;
  emptyText?: string;
  continueText: string;
  companies: CompanyChoiceOption[];
  isLoading?: boolean;
  onSelect: (companyId: string) => void;
}

export const CompanyChoiceSelector = ({
  title,
  description,
  loadingText,
  emptyText,
  continueText,
  companies,
  isLoading = false,
  onSelect,
}: CompanyChoiceSelectorProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleConfirm = () => {
    if (selectedId) {
      onSelect(selectedId);
    }
  };

  const renderCenteredState = (icon: ReactNode, text: string) => (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      {icon}
      <p className="text-playBlueLight text-center">{text}</p>
    </div>
  );

  if (isLoading) {
    return renderCenteredState(
      <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />,
      loadingText
    );
  }

  if (companies.length === 0 && emptyText) {
    return renderCenteredState(
      <Building2 className="h-12 w-12 text-playBlueLight" />,
      emptyText
    );
  }

  return (
    <Card className="w-full max-w-md border border-playBlueLight/30 shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-brand-primary">
          {title}
        </CardTitle>
        <CardDescription className="text-center text-playBlueLight">
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {companies.map((company) => {
            const isSelected = selectedId === company.id;
            return (
              <button
                key={company.id}
                onClick={() => setSelectedId(company.id)}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-playOrange bg-playOrange/10"
                    : "border-playBlueLight/30 hover:border-playBlueLight hover:bg-playGrey/50"
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Building2
                    className={`h-5 w-5 shrink-0 ${
                      isSelected ? "text-playOrange" : "text-playBlueLight"
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`font-medium truncate ${
                        isSelected ? "text-playOrange" : "text-brand-primary"
                      }`}
                    >
                      {company.name}
                    </p>
                    {company.detail && (
                      <p className="text-sm text-playBlueLight truncate">
                        {company.detail}
                      </p>
                    )}
                    {company.badge && (
                      <span className="inline-block mt-1 text-xs font-semibold text-playOrange bg-playOrange/10 px-2 py-0.5 rounded-full">
                        {company.badge}
                      </span>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 shrink-0 text-playOrange" />
                )}
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleConfirm}
          disabled={!selectedId}
          className="w-full bg-brand-primary hover:bg-playBlueLight text-white"
        >
          {continueText}
        </Button>
      </CardContent>
    </Card>
  );
};
