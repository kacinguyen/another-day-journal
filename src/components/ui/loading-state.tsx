import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "spinner" | "skeleton";
  text?: string;
}

const LoadingState = React.forwardRef<HTMLDivElement, LoadingStateProps>(
  ({ className, variant = "spinner", text, ...props }, ref) => {
    if (variant === "skeleton") {
      return (
        <div ref={ref} className={cn("space-y-3", className)} {...props}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-center py-20", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          {text && (
            <p className="text-sm text-muted-foreground">{text}</p>
          )}
        </div>
      </div>
    );
  }
);
LoadingState.displayName = "LoadingState";

export { LoadingState };
