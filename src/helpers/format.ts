import { TrendingKeyword, GoogleTrendsType, Article, Interest, UpdateInterestOptions } from '../types';
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
  keyword?: string,
): TrendingKeyword[] | Article[] | Interest | null => {
  const cleanedText = text.replace(/^\)\]\}',?\s*/, '').trim();
  try {
    const parsedResponse = JSON.parse(cleanedText);

    if (type === 'interest') {
      return updateInterestResponseObject({
        data: parsedResponse,
        keyword: keyword || '',
      });
    }

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

export const updateInterestResponseObject = ({
  data,
  keyword,
  opts = { align: 'mid', includePartial: true },
}: {
  data: unknown;
  keyword: string;
  opts?: UpdateInterestOptions;
}): Interest => {
  console.log('data', data);
  const timelineData = pickTimelineData(data);
  if (!timelineData) {
    throw new Error('Invalid data format');
  }

  const dates: Date[] = [];
  const values: number[] = [];

  for (const point of timelineData) {
    const isPartial = Boolean(point.isPartial);
    if (!opts.includePartial && isPartial) continue;

    const timeStr = point.time;
    const timeSec = timeStr ? Number(timeStr) : NaN;
    if (!Number.isFinite(timeSec)) continue;

    const valueArr = point.value;
    const firstVal = Array.isArray(valueArr) ? valueArr[0] : undefined;
    dates.push(new Date(timeSec * 1000));
    values.push(typeof firstVal === 'number' ? firstVal : 0);
  }
  const idx = dates
    .map((d, i) => [d.getTime(), i])
    .sort((a, b) => a[0] - b[0])
    .map(([, i]) => i);
  return {
    keyword,
    dates: idx.map((i) => dates[i]),
    values: idx.map((i) => values[i]),
  };
};

const pickTimelineData = (input: unknown): Array<Record<string, unknown>> | null => {
  if (!input || typeof input !== 'object') return null;
  const maybeDefault = (input as Record<string, unknown>).default;
  const root =
    maybeDefault && typeof maybeDefault === 'object'
      ? (maybeDefault as Record<string, unknown>)
      : (input as Record<string, unknown>);
  const timeline = root.timelineData;
  if (Array.isArray(timeline)) return timeline as Array<Record<string, unknown>>;
  return null;
};
