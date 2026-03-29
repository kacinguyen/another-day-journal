import { apiGet, apiPost } from "@/services/api";
import type { Era } from "@/types/era";

export function fetchEras(): Promise<Era[]> {
  return apiGet<Era[]>("/eras");
}

export function generateEraImage(
  eraId: number
): Promise<{ imageUrl: string; image: string; mimeType: string }> {
  return apiPost(`/eras/${eraId}/generate-image`, {});
}
