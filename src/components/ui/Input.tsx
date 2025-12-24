import { cn } from "@/app/utils/utis";
import * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  uppercase?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, uppercase = true, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Aplicar uppercase si está habilitado y no es email/password
      if (uppercase && type !== "email" && type !== "password") {
        e.target.value = e.target.value.toUpperCase();
      }
      onChange?.(e);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          uppercase && type !== "email" && type !== "password" && "uppercase",
          className
        )}
        ref={ref}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
