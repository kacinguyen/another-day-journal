import { useEras, useEraImageGeneration } from "@/hooks/useEras";
import FilmStrip from "@/components/eras/FilmStrip";
import { Button } from "@/components/ui/button";
import { Loader2, ImageIcon } from "lucide-react";
import { LoadingState } from "@/components/ui/loading-state";

const Eras = () => {
  const { eras, isLoading } = useEras();
  const { generatingEraId, isGeneratingAll, generate, generateAll } =
    useEraImageGeneration();

  const missingImages = eras.filter((e) => !e.imageUrl);
  const allReady = eras.length > 0 && missingImages.length === 0;

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="page-container space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Eras</h1>
        <p className="text-muted-foreground mt-1">
          Q1 2025 — life chapters on a film strip
        </p>

        {!allReady && (
          <Button
            onClick={() => generateAll(missingImages.map((e) => e.id))}
            disabled={isGeneratingAll || generatingEraId !== null}
            variant="outline"
            className="mt-4"
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <ImageIcon className="mr-2 h-4 w-4" />
                Generate All ({missingImages.length} remaining)
              </>
            )}
          </Button>
        )}
      </div>

      <FilmStrip
        eras={eras}
        generatingEraId={generatingEraId}
        onGenerate={generate}
      />
    </div>
  );
};

export default Eras;
