import * as React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const ErrorState = React.forwardRef<HTMLDivElement, ErrorStateProps>(
  (
    {
      className,
      title = "Something went wrong",
      description,
      onRetry,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center py-12 text-center",
          className
        )}
        {...props}
      >
        <AlertCircle className="h-10 w-10 text-destructive/50 mb-3" />
        <h3 className="text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-sm">
            {description}
          </p>
        )}
        {onRetry && (
          <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
            Try again
          </Button>
        )}
      </div>
    );
  }
);
ErrorState.displayName = "ErrorState";

export { ErrorState };
