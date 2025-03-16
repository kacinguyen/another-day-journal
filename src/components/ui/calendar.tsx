
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-0 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full justify-between",
        head_cell:
          "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
        row: "flex w-full mt-2 justify-between",
        cell: "relative p-0 text-center flex-1 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-foreground"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        // Custom modifier classes with hover states that maintain color identity
        ...{
          greatDay: "bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 hover:bg-pink-50 dark:hover:bg-pink-900 hover:text-pink-900 dark:hover:text-pink-100",
          goodDay: "bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-900 hover:text-green-900 dark:hover:text-green-100",
          neutralDay: "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-900 dark:hover:text-blue-100",
          badDay: "bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-200 hover:bg-orange-50 dark:hover:bg-orange-900 hover:text-orange-900 dark:hover:text-orange-100",
          awfulDay: "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 hover:bg-red-50 dark:hover:bg-red-900 hover:text-red-900 dark:hover:text-red-100",
        },
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
