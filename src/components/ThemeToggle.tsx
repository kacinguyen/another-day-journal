import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

const modes = ["light", "dark", "system"] as const;
type Mode = (typeof modes)[number];

const config: Record<Mode, { icon: typeof Sun; label: string }> = {
  light: { icon: Sun, label: "Light" },
  dark: { icon: Moon, label: "Dark" },
  system: { icon: Monitor, label: "Auto" },
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const current = (theme ?? "system") as Mode;
  const activeIndex = modes.indexOf(current);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center rounded-full bg-muted/80 backdrop-blur-sm border border-border p-1">
      {/* Sliding highlight */}
      <div
        className="absolute h-[calc(100%-8px)] rounded-full bg-background shadow-sm transition-transform duration-200 ease-out"
        style={{
          width: `calc((100% - 8px) / ${modes.length})`,
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {modes.map((mode) => {
        const { icon: Icon } = config[mode];
        const isActive = mode === current;
        return (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={`relative z-10 flex items-center justify-center rounded-full px-3 py-1.5 transition-colors ${
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label={`${config[mode].label} mode`}
          >
            <Icon className="h-3.5 w-3.5" />
          </button>
        );
      })}
    </div>
  );
}
