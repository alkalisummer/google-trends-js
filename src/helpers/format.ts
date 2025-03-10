import { DailyTrendingTopics } from "../types";

export const extractJsonFromResponse = (
  text: string
): DailyTrendingTopics | null => {
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const intermediate = JSON.parse(trimmed);
        const data = JSON.parse(intermediate[0][2]);

        if (!data || !Array.isArray(data) || data.length === 0) {
          return null;
        }

        return updateResponseObject(data[1]);
      } catch (e: unknown) {
        continue;
      }
    }
  }
  return null;
};

const updateResponseObject = (data: unknown[]): DailyTrendingTopics | null => {
  if (!data) {
    return null;
  }

  const allTrendingStories = data;
  const summary: string[] = [];

  data.forEach((item: unknown) => {
    if (Array.isArray(item)) {
      summary.push(String(item[0]));
    }
  });

  return { allTrendingStories, summary };
};
