export interface Era {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  coreVibe: string;
  moodBaseline: string;
  keyEntities: string[];
  palette: string;
  imagePrompt: string;
  imageUrl: string | null;
}
