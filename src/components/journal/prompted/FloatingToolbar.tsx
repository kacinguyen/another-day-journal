import React from "react";
import { Image, Mic, Sparkles, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FloatingToolbarProps {
  visible: boolean;
  onDigDeeper: () => void;
  onFinish: () => void;
  isDiggingDeeper?: boolean;
  isSaving?: boolean;
  canFinish?: boolean;
}

const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  visible,
  onDigDeeper,
  onFinish,
  isDiggingDeeper = false,
  isSaving = false,
  canFinish = true,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border bg-background/95 backdrop-blur-sm px-4 py-2.5 shadow-lg",
        "transition-all duration-300 ease-out",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      {/* Left actions */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={Image}
          label="Add photo"
          onClick={() => toast.info("Photo attachments coming soon")}
        />
        <ToolbarButton
          icon={Mic}
          label="Voice"
          onClick={() => toast.info("Voice mode coming soon")}
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDigDeeper}
          disabled={isDiggingDeeper}
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium",
            "transition-colors",
            isDiggingDeeper
              ? "text-muted-foreground cursor-not-allowed"
              : "text-foreground hover:bg-muted"
          )}
        >
          <Sparkles className={cn("h-4 w-4", isDiggingDeeper && "animate-spin")} />
          Dig Deeper
        </button>

        <button
          onClick={onFinish}
          disabled={!canFinish || isSaving}
          className={cn(
            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm font-medium",
            "transition-colors",
            canFinish && !isSaving
              ? "bg-foreground text-background hover:bg-foreground/90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          )}
        >
          <CheckCircle className="h-4 w-4" />
          {isSaving ? "Saving..." : "Finish entry"}
        </button>
      </div>
    </div>
  );
};

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

export default FloatingToolbar;
