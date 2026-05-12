"use client";

import { useRef, useState } from "react";
import { cn } from "@/app/utils/utis";

interface NumberChipsProps {
  value: number;
  onChange: (v: number) => void;
  options: number[];
  label?: string;
  className?: string;
  min?: number;
}

export const NumberChips = ({
  value,
  onChange,
  options,
  label,
  className,
  min = 0,
}: NumberChipsProps) => {
  const [showInput, setShowInput] = useState(!options.includes(value) && value > 0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCustomClick = () => {
    setShowInput(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    const n = raw === "" ? min : Math.max(min, parseInt(raw, 10));
    onChange(n);
  };

  const isCustom = !options.includes(value);

  return (
    <div className={cn("space-y-1.5", className)}>
      {label && (
        <span className="text-sm font-medium text-brand-primary">{label}</span>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => {
              setShowInput(false);
              onChange(opt);
            }}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              value === opt
                ? "bg-brand-secondary text-white border-brand-secondary"
                : "bg-white text-brand-primary border-brand-accent/40 hover:border-brand-secondary hover:text-brand-secondary"
            )}
          >
            {opt}
          </button>
        ))}

        {showInput ? (
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            value={value === 0 ? "" : String(value)}
            onChange={handleInputChange}
            onBlur={() => {
              if (options.includes(value)) setShowInput(false);
            }}
            className={cn(
              "w-20 px-3 py-1.5 rounded-full text-sm font-medium border text-center",
              isCustom
                ? "bg-brand-secondary text-white border-brand-secondary"
                : "border-brand-accent/40 text-brand-primary"
            )}
          />
        ) : (
          <button
            type="button"
            onClick={handleCustomClick}
            className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
              isCustom
                ? "bg-brand-secondary text-white border-brand-secondary"
                : "bg-white text-brand-primary border-brand-accent/40 hover:border-brand-secondary hover:text-brand-secondary"
            )}
          >
            {isCustom ? value : "Otro"}
          </button>
        )}
      </div>
    </div>
  );
};
