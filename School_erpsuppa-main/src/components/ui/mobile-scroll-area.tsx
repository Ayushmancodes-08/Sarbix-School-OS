import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface MobileScrollAreaProps {
  children: ReactNode;
  className?: string;
}

export function MobileScrollArea({ children, className }: MobileScrollAreaProps) {
  return (
    <div className={cn("overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0", className)}>
      <div className="min-w-[640px] md:min-w-0">
        {children}
      </div>
    </div>
  );
}
