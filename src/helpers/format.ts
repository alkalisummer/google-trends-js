import { TrendingKeyword, GoogleTrendsType, Article, Interest, InterestTrend } from '../types';
import { ParseError } from '../errors/GoogleTrendsError';

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

export const extractJsonFromResponse = (
  text: string,
  type: GoogleTrendsType,
): TrendingKeyword[] | Article[] | Interest | null => {
  const cleanedText = text.replace(/^\)\]\}'/, '').trim();
  try {
    const parsedResponse = JSON.parse(cleanedText);

    if (!Array.isArray(parsedResponse) || parsedResponse.length === 0) {
      throw new ParseError('Invalid response format: empty array');
    }
    const nestedJsonString = parsedResponse[0][2];

    if (!nestedJsonString) {
      throw new ParseError('Invalid response format: missing nested JSON');
    }
    const data = JSON.parse(nestedJsonString);

    if (!data || !Array.isArray(data)) {
      throw new ParseError('Invalid response format: missing data array');
    }

    switch (type) {
      case 'trends':
        return updateTrendsResponseObject(data[1]);
      case 'articles':
        return updateArticlesResponseObject(data[0]);
      case 'interest':
        return updateInterestResponseObject(data[0]);
    }
  } catch (e: unknown) {
    if (e instanceof ParseError) {
      throw e;
    }
    throw new ParseError('Failed to parse response');
  }
};

const updateTrendsResponseObject = (data: unknown[]): TrendingKeyword[] => {
  if (!Array.isArray(data)) {
    throw new ParseError('Invalid data format: expected array');
  }

  const trends: TrendingKeyword[] = [];

  data.forEach((item) => {
    if (!Array.isArray(item)) return;

    const trendsInfo = {
      keyword: String(item[0] || ''),
      traffic: Number(item[6] || '0'),
      trafficGrowthRate: Number(item[8] || '0'),
      activeTime: new Date(Number(item[3] || '0') * 1_000),
      relatedKeywords: item[9] || [],
      articleKeys: item[11] || [],
    };
    trends.push(trendsInfo);
  });

  return trends;
};

const updateArticlesResponseObject = (data: unknown[]): Article[] => {
  if (!Array.isArray(data)) {
    throw new ParseError('Invalid data format: expected array');
  }

  const articles: Article[] = [];
  data.forEach((item) => {
    if (!Array.isArray(item)) return;

    const articleInfo = {
      title: String(item[0] || ''),
      link: String(item[1] || ''),
      mediaCompany: String(item[2] || ''),
      pressDate: item[3] || 0,
      image: String(item[4] || ''),
    };
    articles.push(articleInfo);
  });
  return articles;
};

const updateInterestResponseObject = (data: unknown[][]): Interest => {
  if (!Array.isArray(data)) {
    throw new ParseError('Invalid data format: expected array');
  }

  const keyword = String(data[0][0] || '');
  const dates: Date[] = [];
  const values: number[] = [];

  const trends = data[0][4] as InterestTrend[];

  trends.forEach((trend) => {
    const value = trend[0];
    const timestamps = trend[2];

    const timestamp = timestamps[0] * 1000;
    const dateObj = new Date(timestamp);

    values.push(value);
    dates.push(dateObj);
  });

  return {
    keyword,
    dates,
    values,
  };
};
