"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { cn } from "@/app/utils/utis";

// ============ TYPES ============

export interface DateRange {
  from: string; // YYYY-MM-DD format
  to: string;   // YYYY-MM-DD format
}

export interface DateRangePreset {
  label: string;
  getValue: () => DateRange;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  onApply?: (range: DateRange) => void;
  presets?: DateRangePreset[];
  labels?: {
    from?: string;
    to?: string;
    apply?: string;
    clear?: string;
    presets?: string;
  };
  className?: string;
  disabled?: boolean;
  showApplyButton?: boolean;
}

// ============ HELPER FUNCTIONS ============

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDefaultPresets = (): DateRangePreset[] => {
  const today = new Date();
  
  return [
    {
      label: "Hoy",
      getValue: () => {
        const todayStr = formatDateForInput(today);
        return { from: todayStr, to: todayStr };
      },
    },
    {
      label: "Últimos 7 días",
      getValue: () => {
        const from = new Date(today);
        from.setDate(from.getDate() - 7);
        return { from: formatDateForInput(from), to: formatDateForInput(today) };
      },
    },
    {
      label: "Últimos 30 días",
      getValue: () => {
        const from = new Date(today);
        from.setDate(from.getDate() - 30);
        return { from: formatDateForInput(from), to: formatDateForInput(today) };
      },
    },
    {
      label: "Este mes",
      getValue: () => {
        const from = new Date(today.getFullYear(), today.getMonth(), 1);
        return { from: formatDateForInput(from), to: formatDateForInput(today) };
      },
    },
    {
      label: "Mes anterior",
      getValue: () => {
        const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const to = new Date(today.getFullYear(), today.getMonth(), 0);
        return { from: formatDateForInput(from), to: formatDateForInput(to) };
      },
    },
    {
      label: "Últimos 3 meses",
      getValue: () => {
        const from = new Date(today);
        from.setMonth(from.getMonth() - 3);
        return { from: formatDateForInput(from), to: formatDateForInput(today) };
      },
    },
    {
      label: "Este año",
      getValue: () => {
        const from = new Date(today.getFullYear(), 0, 1);
        return { from: formatDateForInput(from), to: formatDateForInput(today) };
      },
    },
  ];
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday (0) to 7 for European format (Monday first)
  return day === 0 ? 6 : day - 1;
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

// ============ MINI CALENDAR COMPONENT ============

interface MiniCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  minDate?: string;
  maxDate?: string;
  highlightRange?: DateRange;
}

const MiniCalendar: React.FC<MiniCalendarProps> = ({
  selectedDate,
  onDateSelect,
  minDate,
  maxDate,
  highlightRange,
}) => {
  const today = new Date();
  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate);
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const goToPreviousMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 0) {
        return { year: prev.year - 1, month: 11 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  const goToNextMonth = () => {
    setViewDate((prev) => {
      if (prev.month === 11) {
        return { year: prev.year + 1, month: 0 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const isDateInRange = (dateStr: string): boolean => {
    if (!highlightRange?.from || !highlightRange?.to) return false;
    return dateStr >= highlightRange.from && dateStr <= highlightRange.to;
  };

  const isDateDisabled = (dateStr: string): boolean => {
    if (minDate && dateStr < minDate) return true;
    if (maxDate && dateStr > maxDate) return true;
    return false;
  };

  const isToday = (dateStr: string): boolean => {
    return dateStr === formatDateForInput(today);
  };

  const renderDays = () => {
    const days: React.ReactNode[] = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateForInput(new Date(viewDate.year, viewDate.month, day));
      const isSelected = dateStr === selectedDate;
      const inRange = isDateInRange(dateStr);
      const disabled = isDateDisabled(dateStr);
      const isTodayDate = isToday(dateStr);

      days.push(
        <button
          key={day}
          type="button"
          disabled={disabled}
          onClick={() => onDateSelect(dateStr)}
          className={cn(
            "h-8 w-8 rounded-full text-sm font-medium transition-all duration-150",
            "hover:bg-playOrange/10 focus:outline-none focus:ring-2 focus:ring-playOrange/50",
            disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
            isSelected && "bg-playOrange text-white hover:bg-playOrange",
            !isSelected && inRange && "bg-playOrange/20 text-brand-primary",
            !isSelected && !inRange && isTodayDate && "border-2 border-playOrange text-playOrange",
            !isSelected && !inRange && !isTodayDate && "text-brand-primary hover:text-playOrange"
          )}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="p-3">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-1.5 rounded-full hover:bg-playGrey text-playBlueLight hover:text-brand-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-brand-primary">
          {MONTH_NAMES[viewDate.month]} {viewDate.year}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          className="p-1.5 rounded-full hover:bg-playGrey text-playBlueLight hover:text-brand-primary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_NAMES.map((day) => (
          <div
            key={day}
            className="h-8 w-8 flex items-center justify-center text-xs font-medium text-playBlueLight"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  onApply,
  presets,
  labels = {},
  className,
  disabled = false,
  showApplyButton = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCalendar, setActiveCalendar] = useState<"from" | "to" | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const defaultLabels = {
    from: "Desde",
    to: "Hasta",
    apply: "Aplicar",
    clear: "Limpiar",
    presets: "Rangos rápidos",
    ...labels,
  };

  const availablePresets = presets || getDefaultPresets();

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveCalendar(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePresetClick = (preset: DateRangePreset) => {
    const range = preset.getValue();
    onChange(range);
    if (!showApplyButton && onApply) {
      onApply(range);
    }
  };

  const handleDateChange = (field: "from" | "to", dateStr: string) => {
    const newValue = { ...value, [field]: dateStr };
    
    // Auto-correct if from > to
    if (field === "from" && newValue.to && dateStr > newValue.to) {
      newValue.to = dateStr;
    }
    if (field === "to" && newValue.from && dateStr < newValue.from) {
      newValue.from = dateStr;
    }
    
    onChange(newValue);
  };

  const handleApply = () => {
    onApply?.(value);
    setIsOpen(false);
    setActiveCalendar(null);
  };

  const handleClear = () => {
    const today = formatDateForInput(new Date());
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    onChange({ from: formatDateForInput(thirtyDaysAgo), to: today });
  };

  const displayValue = () => {
    if (!value.from && !value.to) return "Seleccionar fechas";
    if (value.from && value.to) {
      return `${formatDateForDisplay(value.from)} - ${formatDateForDisplay(value.to)}`;
    }
    if (value.from) return `Desde ${formatDateForDisplay(value.from)}`;
    return `Hasta ${formatDateForDisplay(value.to)}`;
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 transition-all duration-200",
          "bg-white hover:border-playOrange/50 focus:outline-none focus:ring-2 focus:ring-playOrange/30",
          "min-w-[280px] group",
          isOpen ? "border-playOrange shadow-lg shadow-playOrange/10" : "border-playBlueLight/30",
          disabled && "opacity-50 cursor-not-allowed hover:border-playBlueLight/30"
        )}
      >
        <div className={cn(
          "p-2 rounded-md transition-colors",
          isOpen ? "bg-playOrange text-white" : "bg-playGrey text-playBlueLight group-hover:bg-playOrange/10 group-hover:text-playOrange"
        )}>
          <Calendar className="h-4 w-4" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-xs text-playBlueLight font-medium uppercase tracking-wide">
            {defaultLabels.presets}
          </div>
          <div className="text-sm font-semibold text-brand-primary">
            {displayValue()}
          </div>
        </div>
        <ChevronDown className={cn(
          "h-4 w-4 text-playBlueLight transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={cn(
          "absolute z-50 mt-2 bg-white rounded-xl border border-playBlueLight/20",
          "shadow-xl shadow-brand-primary/10 overflow-hidden",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}>
          <div className="flex">
            {/* Presets Column */}
            <div className="w-48 border-r border-playBlueLight/10 bg-playGrey/30 p-2">
              <div className="text-xs font-semibold text-playBlueLight uppercase tracking-wide px-3 py-2">
                {defaultLabels.presets}
              </div>
              <div className="space-y-0.5">
                {availablePresets.map((preset, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handlePresetClick(preset)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                      "text-brand-primary hover:bg-playOrange/10 hover:text-playOrange",
                      "focus:outline-none focus:bg-playOrange/10"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Calendars Column */}
            <div className="p-4">
              <div className="flex gap-6">
                {/* From Date */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveCalendar(activeCalendar === "from" ? null : "from")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all w-full",
                      activeCalendar === "from"
                        ? "border-playOrange bg-playOrange/5"
                        : "border-playBlueLight/30 hover:border-playOrange/50"
                    )}
                  >
                    <span className="text-xs text-playBlueLight font-medium">{defaultLabels.from}:</span>
                    <span className="text-sm font-semibold text-brand-primary">
                      {value.from ? formatDateForDisplay(value.from) : "—"}
                    </span>
                  </button>
                  {activeCalendar === "from" && (
                    <div className="mt-2 border border-playBlueLight/20 rounded-lg bg-white shadow-lg">
                      <MiniCalendar
                        selectedDate={value.from}
                        onDateSelect={(date) => handleDateChange("from", date)}
                        maxDate={value.to || undefined}
                        highlightRange={value}
                      />
                    </div>
                  )}
                </div>

                {/* Arrow separator */}
                <div className="flex items-start pt-3">
                  <div className="w-8 h-0.5 bg-playBlueLight/30 mt-3.5" />
                </div>

                {/* To Date */}
                <div>
                  <button
                    type="button"
                    onClick={() => setActiveCalendar(activeCalendar === "to" ? null : "to")}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all w-full",
                      activeCalendar === "to"
                        ? "border-playOrange bg-playOrange/5"
                        : "border-playBlueLight/30 hover:border-playOrange/50"
                    )}
                  >
                    <span className="text-xs text-playBlueLight font-medium">{defaultLabels.to}:</span>
                    <span className="text-sm font-semibold text-brand-primary">
                      {value.to ? formatDateForDisplay(value.to) : "—"}
                    </span>
                  </button>
                  {activeCalendar === "to" && (
                    <div className="mt-2 border border-playBlueLight/20 rounded-lg bg-white shadow-lg">
                      <MiniCalendar
                        selectedDate={value.to}
                        onDateSelect={(date) => handleDateChange("to", date)}
                        minDate={value.from || undefined}
                        highlightRange={value}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {showApplyButton && (
                <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-playBlueLight/10">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-playBlueLight hover:text-brand-primary transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    {defaultLabels.clear}
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                      "bg-playOrange text-white hover:bg-playOrange/90",
                      "focus:outline-none focus:ring-2 focus:ring-playOrange/50"
                    )}
                  >
                    {defaultLabels.apply}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
