import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/app/utils/utis";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-playGreen text-white hover:bg-playGreen/90",
        secondary:
          "border-transparent bg-playYellow text-black hover:bg-playYellow/80",
        destructive:
          "border-transparent bg-brand-secondary text-white hover:bg-brand-secondary/90",
        outline: "text-brand-primary border-playBlueLight",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
