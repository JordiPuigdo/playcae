"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { QuoteLanguage, QuoteStatus } from "@/types/quote";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";

export interface QuoteFiltersState {
  search: string;
  status: QuoteStatus | "all";
  language: QuoteLanguage | "all";
}

interface QuoteFiltersProps {
  initialFilters?: Partial<QuoteFiltersState>;
  onFilter: (filters: QuoteFiltersState) => void;
}

export const QuoteFilters = ({ initialFilters, onFilter }: QuoteFiltersProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(initialFilters?.search ?? "");
  const [status, setStatus] = useState<QuoteStatus | "all">(
    initialFilters?.status ?? "all"
  );
  const [language, setLanguage] = useState<QuoteLanguage | "all">(
    initialFilters?.language ?? "all"
  );

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onFilter({ search: value, status, language });
    }, 300);
  };

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const handleStatus = (val: QuoteStatus | "all") => {
    setStatus(val);
    onFilter({ search, status: val, language });
  };

  const handleLanguage = (val: QuoteLanguage | "all") => {
    setLanguage(val);
    onFilter({ search, status, language: val });
  };

  const clear = () => {
    setSearch("");
    setStatus("all");
    setLanguage("all");
    onFilter({ search: "", status: "all", language: "all" });
  };

  const hasActive = search !== "" || status !== "all" || language !== "all";

  return (
    <Card className="border border-playBlueLight/30 bg-white">
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium text-brand-primary">
              {t("quotes.filters.search")}
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                placeholder={t("quotes.filters.searchPlaceholder")}
                value={search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-playBlueLight focus-visible:ring-brand-primary"
              />
            </div>
          </div>

          <div className="space-y-2 min-w-[200px]">
            <label className="text-sm font-medium text-brand-primary">
              {t("quotes.filters.status")}
            </label>
            <Select
              value={String(status)}
              onValueChange={(v) =>
                handleStatus(v === "all" ? "all" : (Number(v) as QuoteStatus))
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem value="all">{t("quotes.filters.allStatus")}</SelectItem>
                <SelectItem value={String(QuoteStatus.Draft)}>{t("quotes.status.draft")}</SelectItem>
                <SelectItem value={String(QuoteStatus.Sent)}>{t("quotes.status.sent")}</SelectItem>
                <SelectItem value={String(QuoteStatus.Accepted)}>{t("quotes.status.accepted")}</SelectItem>
                <SelectItem value={String(QuoteStatus.Rejected)}>{t("quotes.status.rejected")}</SelectItem>
                <SelectItem value={String(QuoteStatus.Expired)}>{t("quotes.status.expired")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 min-w-[160px]">
            <label className="text-sm font-medium text-brand-primary">
              {t("quotes.filters.language")}
            </label>
            <Select
              value={String(language)}
              onValueChange={(v) =>
                handleLanguage(v === "all" ? "all" : (Number(v) as QuoteLanguage))
              }
            >
              <SelectTrigger className="border-playBlueLight focus-visible:ring-brand-primary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border border-playBlueLight/30">
                <SelectItem value="all">{t("quotes.filters.allLanguages")}</SelectItem>
                <SelectItem value={String(QuoteLanguage.Es)}>{t("quotes.language.es")}</SelectItem>
                <SelectItem value={String(QuoteLanguage.Ca)}>{t("quotes.language.ca")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={clear}
            disabled={!hasActive}
            className={`gap-2 border-playBlueLight transition-all ${
              hasActive
                ? "text-brand-primary hover:bg-playGrey"
                : "opacity-40 cursor-not-allowed"
            }`}
          >
            <X className="h-4 w-4" />
            {t("quotes.filters.clear")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
