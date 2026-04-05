import * as React from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon: Icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
        {...props}
      >
        {Icon && (
          <Icon className="h-10 w-10 text-muted-foreground/50 mb-3" />
        )}
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {description}
          </p>
        )}
        {action && <div className="mt-4">{action}</div>}
      </div>
    );
  }
);
EmptyState.displayName = "EmptyState";

export { EmptyState };
