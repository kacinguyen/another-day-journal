import React, { useCallback, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import MoodPicker from "@/components/journal/MoodPicker";
import MoodFactorPicker from "./MoodFactorPicker";
import { MoodType } from "@/components/journal/types/mood-types";
import { EmotionType } from "@/components/journal/types/emotion-types";
import { predefinedEmotions } from "@/components/journal/data/emotionOptions";
import { getEmotionColor } from "@/styles/tokens";

interface PromptedCarouselProps {
  mood: MoodType;
  emotions: EmotionType[];
  moodFactors: string[];
  onMoodChange: (mood: MoodType) => void;
  onEmotionToggle: (emotion: EmotionType) => void;
  onMoodFactorToggle: (factor: string) => void;
}

const PromptedCarousel: React.FC<PromptedCarouselProps> = ({
  mood,
  emotions,
  moodFactors,
  onMoodChange,
  onEmotionToggle,
  onMoodFactorToggle,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [hasAutoAdvanced, setHasAutoAdvanced] = useState(false);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => { api.off("select", onSelect); };
  }, [api]);

  // Auto-advance when mood is selected — only the first time
  useEffect(() => {
    if (mood && current === 0 && api && !hasAutoAdvanced) {
      const timer = setTimeout(() => {
        api.scrollNext();
        setHasAutoAdvanced(true);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [mood, current, api, hasAutoAdvanced]);

  const canGoNext = useCallback(() => {
    if (current === 0) return mood !== null;
    if (current === 1) return emotions.length > 0;
    return false; // last slide
  }, [current, mood, emotions]);

  const handleNext = useCallback(() => {
    if (canGoNext() && api) api.scrollNext();
  }, [canGoNext, api]);

  const handlePrev = useCallback(() => {
    if (api) api.scrollPrev();
  }, [api]);

  const totalSteps = 3;

  return (
    <div className="space-y-3">
      {/* Step indicators */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === current
                  ? "w-6 bg-foreground"
                  : i < current
                    ? "w-1.5 bg-foreground/60"
                    : "w-1.5 bg-muted-foreground/30"
              )}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            disabled={current === 0}
            className={cn(
              "p-1 rounded-md transition-colors",
              current === 0
                ? "text-muted-foreground/30 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNext}
            disabled={!canGoNext()}
            className={cn(
              "p-1 rounded-md transition-colors",
              !canGoNext()
                ? "text-muted-foreground/30 cursor-not-allowed"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{ watchDrag: false }}
        className="w-full"
      >
        <CarouselContent>
          {/* Q1: How are you feeling? */}
          <CarouselItem>
            <div className="py-1">
              <MoodPicker value={mood} onChange={onMoodChange} />
            </div>
          </CarouselItem>

          {/* Q2: What best describes this feeling? */}
          <CarouselItem>
            <div className="space-y-3 py-1">
              <p className="text-sm text-muted-foreground font-medium">
                What best describes this feeling?
              </p>
              <div className="flex flex-wrap gap-2">
                {predefinedEmotions.map((emotion) => {
                  const isSelected = emotions.includes(emotion.value);
                  const colors = getEmotionColor(emotion.value);
                  return (
                    <button
                      key={emotion.value}
                      onClick={() => onEmotionToggle(emotion.value)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
                        "border transition-all duration-200",
                        isSelected ? colors.activeColor : colors.color
                      )}
                    >
                      {emotion.icon}
                      <span className="capitalize">{emotion.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </CarouselItem>

          {/* Q3: What's impacting your mood? */}
          <CarouselItem>
            <div className="py-1">
            <MoodFactorPicker
              selected={moodFactors}
              onToggle={onMoodFactorToggle}
            />
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default PromptedCarousel;
