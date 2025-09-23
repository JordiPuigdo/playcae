"use client";

import * as React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/app/utils/utis";

import { ca } from "date-fns/locale";

interface DatePickerProps {
  id: string;
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  className?: string;
}

export const DatePicker = ({
  id,
  value,
  onChange,
  placeholder = "Selecciona una fecha",
  className,
}: DatePickerProps) => {
  return (
    <div className="relative w-full">
      <ReactDatePicker
        id={id}
        selected={value}
        onChange={onChange}
        dateFormat="dd/MM/yyyy"
        locale={ca}
        placeholderText={placeholder}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
      />
    </div>
  );
};
