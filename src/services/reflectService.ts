import { apiPost } from "./api";

interface ReflectRequest {
  content: string;
  mood?: string;
  emotions?: string[];
  moodFactors?: string[];
}

interface ReflectResponse {
  questions: string[];
}

export async function getReflectionQuestions(
  data: ReflectRequest
): Promise<string[]> {
  const response = await apiPost<ReflectResponse>(
    "/reflect/questions",
    data
  );
  return response.questions;
}
