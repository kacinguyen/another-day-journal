import { useState, useRef, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { ImageIcon, Loader2, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Era } from "@/types/era";

interface FilmStripProps {
  eras: Era[];
  generatingEraId: number | null;
  onGenerate: (eraId: number) => void;
}

function formatDateRange(start: string, end: string): string {
  return `${format(parseISO(start), "MMM d")} – ${format(parseISO(end), "MMM d, yyyy")}`;
}

const FRAME_WIDTH = 288; // w-72
const GAP = 24; // gap-6
const STEP = FRAME_WIDTH + GAP;
const AUTO_SCROLL_SPEED = 0.5; // px per frame

const FilmStrip = ({ eras, generatingEraId, onGenerate }: FilmStripProps) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);

  // Total width of one set of eras
  const totalWidth = eras.length * STEP;

  const animate = useCallback(() => {
    if (!scrollRef.current || !isPlaying) return;
    offsetRef.current += AUTO_SCROLL_SPEED;
    if (offsetRef.current >= totalWidth) {
      offsetRef.current -= totalWidth;
    }
    scrollRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
    rafRef.current = requestAnimationFrame(animate);
  }, [isPlaying, totalWidth]);

  useEffect(() => {
    if (isPlaying) {
      rafRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPlaying, animate]);

  const stepTo = (direction: "prev" | "next") => {
    setIsPlaying(false);
    cancelAnimationFrame(rafRef.current);
    // Snap to nearest frame
    const currentFrame = Math.round(offsetRef.current / STEP);
    const targetFrame = direction === "next" ? currentFrame + 1 : currentFrame - 1;
    offsetRef.current = ((targetFrame % eras.length) + eras.length) % eras.length * STEP;
    if (scrollRef.current) {
      scrollRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
    }
  };

  // Duplicate eras for seamless loop
  const frames = [...eras, ...eras];

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => stepTo("prev")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => stepTo("next")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Strip */}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollRef}
          className="flex gap-6"
          style={{ willChange: "transform" }}
        >
          {frames.map((era, i) => (
            <div
              key={`${era.id}-${i}`}
              className="flex-shrink-0 w-72"
            >
              {/* Image */}
              <div className="w-72 h-72 rounded-lg overflow-hidden bg-muted">
                {era.imageUrl ? (
                  <img
                    src={era.imageUrl}
                    alt={era.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGenerate(era.id);
                      }}
                      disabled={generatingEraId !== null}
                      variant="ghost"
                      size="sm"
                    >
                      {generatingEraId === era.id ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <ImageIcon className="h-5 w-5" />
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div className="mt-3 px-1">
                <h3 className="font-semibold text-sm leading-tight">
                  {era.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDateRange(era.startDate, era.endDate)}
                </p>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {era.coreVibe}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmStrip;
