"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus, Search, X } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { LeadService } from "@/services/lead.service";
import { LeadListItem } from "@/types/lead";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

export interface LeadPickerSelection {
  id: string;
  companyName: string;
  email: string;
}

interface LeadPickerProps {
  value: LeadPickerSelection | null;
  onChange: (lead: LeadPickerSelection | null) => void;
  onCreateNew: () => void;
  disabled?: boolean;
}

export const LeadPicker = ({ value, onChange, onCreateNew, disabled }: LeadPickerProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<LeadListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const service = useMemo(() => new LeadService(), []);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Server-side debounced search
  useEffect(() => {
    if (!open) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await service.getAll({
          page: 1,
          pageSize: 20,
          search: search.trim() || undefined,
        });
        setItems(response.data.items ?? []);
        setTotal(response.data.total ?? 0);
      } catch {
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [search, open, service]);

  const handleSelect = (lead: LeadListItem) => {
    onChange({ id: lead.id!, companyName: lead.companyName, email: lead.email });
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Selected chip / trigger */}
      {value ? (
        <div className="flex items-center gap-2 rounded-md border border-brand-accent bg-white px-3 py-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-brand-primary truncate">
              {value.companyName}
            </div>
            <div className="text-xs text-brand-accent truncate">{value.email}</div>
          </div>
          {!disabled && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onChange(null);
                setOpen(true);
              }}
              className="border-brand-accent"
              title={t("common.clear")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      ) : (
        <button
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className="flex w-full items-center justify-between rounded-md border border-brand-accent bg-white px-3 py-2 text-sm text-left hover:border-playBlueLight transition-colors"
        >
          <span className="text-muted-foreground">
            {t("quotes.form.selectLead")}
          </span>
          <ChevronDown className="h-4 w-4 text-brand-accent" />
        </button>
      )}

      {/* Dropdown */}
      {open && !value && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-playBlueLight/40 bg-white shadow-lg">
          <div className="p-2 border-b border-playBlueLight/20">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-playBlueLight" />
              <Input
                uppercase={false}
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("quotes.form.leadSearchPlaceholder")}
                className="pl-8 border-playBlueLight"
              />
            </div>
            <div className="flex items-center justify-between mt-2 px-1">
              <span className="text-xs text-brand-accent">
                {loading
                  ? t("common.loading")
                  : t("quotes.form.leadResultsCount", {
                      shown: items.length,
                      total,
                    })}
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setOpen(false);
                  onCreateNew();
                }}
                className="border-playOrange text-playOrange hover:bg-playOrange/10 gap-1"
              >
                <Plus className="h-3 w-3" />
                {t("quotes.form.createNewLead")}
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {!loading && items.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">
                {t("quotes.form.noLeadsFound")}
              </div>
            )}
            {items.map((lead) => (
              <button
                type="button"
                key={lead.id}
                onClick={() => handleSelect(lead)}
                className="w-full text-left px-3 py-2 hover:bg-playGrey transition-colors border-b border-playBlueLight/10 last:border-b-0"
              >
                <div className="text-sm font-medium text-brand-primary">
                  {lead.companyName}
                </div>
                <div className="text-xs text-brand-accent flex gap-2">
                  <span className="truncate">{lead.email}</span>
                  {lead.taxId && <span className="font-mono">· {lead.taxId}</span>}
                </div>
              </button>
            ))}
            {!loading && items.length > 0 && total > items.length && (
              <div className="p-2 text-center text-xs text-muted-foreground border-t border-playBlueLight/10">
                {t("quotes.form.refineSearch")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
