export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingMinutes: number;
  speakingMinutes: number;
}

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+/g)?.length ?? (trimmed ? 1 : 0)) : 0;
  const paragraphs = trimmed ? trimmed.split(/\n{2,}/).filter((p) => p.trim()).length : 0;

  return {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words,
    sentences,
    paragraphs,
    readingMinutes: words / 200,
    speakingMinutes: words / 130,
  };
}

export function formatMinutes(minutes: number): string {
  if (minutes < 1 / 60) return "< 1 sec";
  if (minutes < 1) return `${Math.round(minutes * 60)} sec`;
  return `${minutes.toFixed(1)} min`;
}
