import React from "react";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Calendar, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InlineTag } from "./usePromptedEntry";

interface TagsSidebarProps {
  tags: InlineTag[];
}

const categoryConfig = {
  person: {
    label: "People",
    icon: User,
    bg: "bg-blue-100 dark:bg-blue-950",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-800",
  },
  place: {
    label: "Places",
    icon: MapPin,
    bg: "bg-green-100 dark:bg-green-950",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-200 dark:border-green-800",
  },
  event: {
    label: "Events",
    icon: Calendar,
    bg: "bg-purple-100 dark:bg-purple-950",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-200 dark:border-purple-800",
  },
  activity: {
    label: "Activities",
    icon: Dumbbell,
    bg: "bg-orange-100 dark:bg-orange-950",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-200 dark:border-orange-800",
  },
} as const;

const TagsSidebar: React.FC<TagsSidebarProps> = ({ tags }) => {
  const grouped = tags.reduce(
    (acc, tag) => {
      if (!acc[tag.category]) acc[tag.category] = [];
      // Deduplicate by text (case-insensitive)
      const exists = acc[tag.category].some(
        (t) => t.text.toLowerCase() === tag.text.toLowerCase()
      );
      if (!exists) acc[tag.category].push(tag);
      return acc;
    },
    {} as Record<string, InlineTag[]>
  );

  const hasAnyTags = tags.length > 0;

  if (!hasAnyTags) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Tags</h3>
        <p className="text-xs text-muted-foreground">
          Highlight words in your entry to tag people, places, events, and activities.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold">Tags</h3>
      {(Object.keys(categoryConfig) as Array<keyof typeof categoryConfig>).map(
        (category) => {
          const items = grouped[category];
          if (!items?.length) return null;
          const config = categoryConfig[category];
          const Icon = config.icon;

          return (
            <div key={category} className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <Icon className={cn("h-3.5 w-3.5", config.text)} />
                <span className={cn("text-xs font-medium", config.text)}>
                  {config.label}
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((tag, i) => (
                  <Badge
                    key={`${tag.text}-${i}`}
                    variant="outline"
                    className={cn(
                      "text-xs font-medium",
                      config.bg,
                      config.text,
                      config.border
                    )}
                  >
                    {tag.text}
                  </Badge>
                ))}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
};

export default TagsSidebar;
