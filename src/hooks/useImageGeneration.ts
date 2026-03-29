import { useState, useCallback } from "react";
import { apiPost } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface GenerateImageParams {
  content: string;
  mood?: string;
  activities?: string[];
  emotions?: string[];
}

interface GenerateImageResponse {
  image: string;
  mimeType: string;
}

export function useImageGeneration() {
  const [imageData, setImageData] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>("image/png");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateImage = useCallback(
    async (params: GenerateImageParams) => {
      setIsGenerating(true);
      setImageData(null);

      try {
        const data = await apiPost<GenerateImageResponse>(
          "/image/generate",
          params
        );
        setImageData(data.image);
        setMimeType(data.mimeType);
      } catch (error) {
        console.error("Error generating image:", error);
        toast({
          title: "Image generation failed",
          description:
            error instanceof Error ? error.message : "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setIsGenerating(false);
      }
    },
    [toast]
  );

  const clearImage = useCallback(() => {
    setImageData(null);
  }, []);

  const downloadImage = useCallback(() => {
    if (!imageData) return;
    const ext = mimeType.split("/")[1] || "png";
    const link = document.createElement("a");
    link.href = `data:${mimeType};base64,${imageData}`;
    link.download = `journal-illustration.${ext}`;
    link.click();
  }, [imageData, mimeType]);

  return {
    imageData,
    mimeType,
    isGenerating,
    generateImage,
    clearImage,
    downloadImage,
  };
}
