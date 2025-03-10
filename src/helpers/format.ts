import { DailyTrendingTopics } from "../types";

// For future refrence and update: from google trends page rpc call response, 
// 0	"twitter down"	The main trending search term.
// 1	null	Unused (reserved for future Google Trends data).
// 2	"US"	Country code (where the trend is happening).
// 3	[1741599600]	Unix timestamp (represents when the search started trending).
// 4	null	Unused (reserved for future data).
// 5	null	Unused (reserved for future data).
// 6	500000	Search volume index (estimated search interest for the term).
// 7	null	Unused (reserved for future data).
// 8	1000	Trend ranking score (higher means more popular).
// 9	["twitter down", "is twitter down", "is x down", ...]	Related searches (other queries that users searched alongside this term).
// 10	[11]	Unclear, possibly a category identifier.
// 11	[[3606769742, "en", "US"], [3596035008, "en", "US"]]	User demographics or trending sources, with numerical IDs, language ("en" for English), and country ("US" for United States).
// 12	"twitter down"	The original trending keyword (sometimes a duplicate of index 0).

export const extractJsonFromResponse = (text: string): DailyTrendingTopics | null => {
  const cleanedText = text.replace(/^\)\]\}'/, "").trim();
  try {
    const parsedResponse = JSON.parse(cleanedText);

    if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
      return null;
    }
    const nestedJsonString = parsedResponse[0][2];

    if (!nestedJsonString) {
      return null;
    }
    const data = JSON.parse(nestedJsonString);

    if (!data || !Array.isArray(data) || data.length < 2) {
      return null;
    }

    return updateResponseObject(data[1]);
  } catch (e: unknown) {
    console.error("Failed to parse response:", e);
    return null;
  }
};

const updateResponseObject = (data: unknown[]): DailyTrendingTopics | null => {
  if (!Array.isArray(data)) {
    return null;
  }

  const allTrendingStories = data;
  const summary: string[] = [];

  data.forEach((item: unknown) => {
    if (Array.isArray(item) && typeof item[0] === "string") {
      summary.push(item[0]); // First element is usually the trending keyword 
    }
  });

  return { allTrendingStories, summary };
};
