"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/app/utils/utis";

// ============ TYPES ============

export interface DatePickerProps {
  id?: string;
  value: string; // YYYY-MM-DD or empty string
  onChange: (date: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  min?: string; // YYYY-MM-DD
  max?: string; // YYYY-MM-DD
}

// ============ HELPERS ============

const normalizeDate = (dateString: string): string => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

const formatForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  const [year, month, day] = normalizeDate(dateString).split("-");
  return `${day}/${month}/${year}`;
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDaysInMonth = (year: number, month: number): number =>
  new Date(year, month + 1, 0).getDate();

const getFirstDayOfMonth = (year: number, month: number): number => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
};

const MONTH_NAMES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

// ============ CALENDAR COMPONENT ============

interface CalendarPanelProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
  min?: string;
  max?: string;
}

const CalendarPanel: React.FC<CalendarPanelProps> = ({
  selectedDate,
  onDateSelect,
  min,
  max,
}) => {
  const today = new Date();
  const todayStr = formatDateForInput(today);

  const [viewDate, setViewDate] = useState(() => {
    if (selectedDate) {
      const d = new Date(selectedDate + "T00:00:00");
      return { year: d.getFullYear(), month: d.getMonth() };
    }
    return { year: today.getFullYear(), month: today.getMonth() };
  });

  const goToPrev = () =>
    setViewDate((p) =>
      p.month === 0 ? { year: p.year - 1, month: 11 } : { ...p, month: p.month - 1 }
    );

  const goToNext = () =>
    setViewDate((p) =>
      p.month === 11 ? { year: p.year + 1, month: 0 } : { ...p, month: p.month + 1 }
    );

  const daysInMonth = getDaysInMonth(viewDate.year, viewDate.month);
  const firstDay = getFirstDayOfMonth(viewDate.year, viewDate.month);

  const days: React.ReactNode[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`e-${i}`} className="h-8 w-8" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = formatDateForInput(new Date(viewDate.year, viewDate.month, d));
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayStr;
    const disabled = (min && dateStr < min) || (max && dateStr > max);

    days.push(
      <button
        key={d}
        type="button"
        disabled={!!disabled}
        onClick={() => onDateSelect(dateStr)}
        className={cn(
          "h-8 w-8 rounded-full text-sm font-medium transition-all duration-150",
          "hover:bg-playOrange/10 focus:outline-none focus:ring-2 focus:ring-playOrange/50",
          disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
          isSelected && "bg-playOrange text-white hover:bg-playOrange",
          !isSelected && isToday && "border-2 border-playOrange text-playOrange",
          !isSelected && !isToday && "text-brand-primary hover:text-playOrange"
        )}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goToPrev}
          className="p-1.5 rounded-full hover:bg-playGrey text-playBlueLight hover:text-brand-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-semibold text-brand-primary">
          {MONTH_NAMES[viewDate.month]} {viewDate.year}
        </span>
        <button
          type="button"
          onClick={goToNext}
          className="p-1.5 rounded-full hover:bg-playGrey text-playBlueLight hover:text-brand-primary transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

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

      <div className="grid grid-cols-7 gap-1">{days}</div>
    </div>
  );
};

// ============ MAIN COMPONENT ============

export const DatePicker: React.FC<DatePickerProps> = ({
  id,
  value: rawValue,
  onChange,
  placeholder = "Selecciona una fecha",
  className,
  disabled = false,
  min,
  max,
}) => {
  const value = normalizeDate(rawValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date: string) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <button
        id={id}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 w-full px-3 py-2 rounded-lg border-2 transition-all duration-200",
          "bg-white hover:border-playOrange/50 focus:outline-none focus:ring-2 focus:ring-playOrange/30",
          "group text-left",
          isOpen ? "border-playOrange shadow-lg shadow-playOrange/10" : "border-playBlueLight/30",
          disabled && "opacity-50 cursor-not-allowed hover:border-playBlueLight/30"
        )}
      >
        <div
          className={cn(
            "p-1.5 rounded-md transition-colors shrink-0",
            isOpen
              ? "bg-playOrange text-white"
              : "bg-playGrey text-playBlueLight group-hover:bg-playOrange/10 group-hover:text-playOrange"
          )}
        >
          <Calendar className="h-4 w-4" />
        </div>

        <span
          className={cn(
            "flex-1 text-sm",
            value ? "font-semibold text-brand-primary" : "text-playBlueLight"
          )}
        >
          {value ? formatForDisplay(value) : placeholder}
        </span>

        {value ? (
          <button
            type="button"
            onClick={handleClear}
            className="p-0.5 rounded-full text-playBlueLight hover:text-brand-primary transition-colors"
            tabIndex={-1}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-playBlueLight transition-transform duration-200 shrink-0",
              isOpen && "rotate-180"
            )}
          />
        )}
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 bg-white rounded-xl border border-playBlueLight/20",
            "shadow-xl shadow-brand-primary/10 overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-200"
          )}
        >
          <CalendarPanel
            selectedDate={value}
            onDateSelect={handleSelect}
            min={min}
            max={max}
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
