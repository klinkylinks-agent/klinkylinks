import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GradientBorderProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}

export function GradientBorder({ children, className, innerClassName }: GradientBorderProps) {
  return (
    <div className={cn("gradient-border", className)}>
      <div className={cn("gradient-border-inner", innerClassName)}>
        {children}
      </div>
    </div>
  );
}

export default GradientBorder;
