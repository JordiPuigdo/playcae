import { useState } from "react";

interface InfoTooltipProps {
  text: string;
}

export const InfoTooltip = ({ text }: InfoTooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <span
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setTimeout(() => setIsVisible(false), 500)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setTimeout(() => setIsVisible(false), 500)}
    >
      <button
        type="button"
        aria-label="Más información"
        className="ml-1 w-4 h-4 rounded-full bg-muted-foreground/20 text-xs font-bold text-muted-foreground flex items-center justify-center hover:bg-muted-foreground/30 focus:outline-none"
      >
        ?
      </button>
      {isVisible && (
        <div className="absolute z-10 left-1/2 -translate-x-1/2 mt-24 w-56 rounded-md bg-popover p-2 text-sm shadow-md text-popover-foreground font-semibold">
          {text}
        </div>
      )}
    </span>
  );
};
