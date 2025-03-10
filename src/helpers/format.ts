export const extractJsonFromResponse = (
  text: string
): {
  allTrendingStories: unknown[];
  summary: string[];
} | null => {
  const lines = text.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const intermediate = JSON.parse(trimmed);
        const data = JSON.parse(intermediate[0][2]);

        return updateResponseObject(data[1]);
      } catch (e: unknown) {
        console.warn(`Error parsing JSON: ${e}`);
        continue;
      }
    }
  }
  return null;
};

const updateResponseObject = (data: unknown[]) => {
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
