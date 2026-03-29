import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { fetchEras, generateEraImage } from "@/services/erasApi";
import { toast } from "@/hooks/use-toast";

export function useEras() {
  const query = useQuery({
    queryKey: ["eras"],
    queryFn: fetchEras,
  });
  return {
    eras: query.data ?? [],
    isLoading: query.isLoading,
  };
}

export function useEraImageGeneration() {
  const [generatingEraId, setGeneratingEraId] = useState<number | null>(null);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const queryClient = useQueryClient();

  const generate = async (eraId: number) => {
    if (generatingEraId !== null && !isGeneratingAll) return;
    setGeneratingEraId(eraId);
    try {
      await generateEraImage(eraId);
      await queryClient.invalidateQueries({ queryKey: ["eras"] });
    } catch (error: any) {
      toast({
        title: "Image generation failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
      throw error;
    } finally {
      setGeneratingEraId(null);
    }
  };

  const generateAll = async (eraIds: number[]) => {
    setIsGeneratingAll(true);
    try {
      for (const id of eraIds) {
        await generate(id);
      }
    } finally {
      setIsGeneratingAll(false);
    }
  };

  return { generatingEraId, isGeneratingAll, generate, generateAll };
}
