export type GoogleTrendsMapper = {
  path: string;
  method: string;
  host: string;
  url: string;
  headers: Record<string, string>;
};

export const enum GoogleTrendsEndpoints {
  dailyTrends = 'dailyTrends',
  autocomplete = 'autocomplete',
  explore = 'explore',
  interestByRegion = 'interestByRegion',
  interestOverTime = 'interestOverTime',
}

// TRENDING TOPICS

export const enum GoogleTrendsTrendingHours {
  fourHrs = 4,
  oneDay = 24,
  twoDays = 48,
  sevenDays = 168,
}

export type DailyTrendingTopicsOptions = {
  geo?: string;
  hl?: string;
};

export interface TrendingStory {
  title: string;
  traffic: string;
  image?: {
    newsUrl: string;
    source: string;
    imageUrl: string;
  };
  articles: Array<{
    title: string;
    url: string;
    source: string;
    time: string;
    snippet: string;
  }>;
  shareUrl: string;
}

export interface TrendingKeyword {
  keyword: string;
  traffic: number;
  trafficGrowthRate: number;
  activeTime: Date;
  relatedKeywords: string[];
  articleKeys: ArticleKey[];
}

export type TrendingArticlesOptions = {
  articleKeys: ArticleKey[];
  articleCount: number;
};

export type ArticleKey = [number, string, string];

export interface Article {
  title: string;
  link: string;
  mediaCompany: string;
  pressDate: number[];
  image: string;
}

export interface InterestOverTimeOptions {
  keyword: string;
  geo?: string;
  period?: GoogleTrendsTimeOptions;
  hl?: string;
}

export interface Interest {
  keyword: string;
  dates: Date[];
  values: number[];
}

export type Seconds = number;
export type Nanos = number;

export type TimestampTuple = [Seconds] | [Seconds, Nanos];

export type RangeTuple = [start: TimestampTuple, end: TimestampTuple];

export type InterestTrend = [value: number, rounded: number, range: RangeTuple, isPartial: boolean];

export type UpdateInterestAlign = 'mid' | 'start' | 'end';

export interface UpdateInterestOptions {
  align?: UpdateInterestAlign;
  includePartial?: boolean;
}

export interface DailyTrendingTopics {
  allTrendingStories: TrendingStory[];
  summary: TrendingKeyword[];
}

// Real Time Trends

export type RealTimeTrendsOptions = {
  geo: string;
  trendingHours?: number;
};

// Interest Over Time

export type GoogleTrendsTimeOptions =
  | 'now 1-h'
  | 'now 4-h'
  | 'now 1-d'
  | 'now 7-d'
  | 'now 1-m'
  | 'today 3-m'
  | 'today 12-m'
  | 'today 5-y';

// Explore

export type ExploreOptions = {
  keyword: string;
  geo?: string;
  time?: string;
  category?: number;
  property?: string;
  hl?: string;
};

export type ExploreResponse = {
  widgets: Array<{
    id: string;
    request: {
      time: string;
      resolution: string;
      comparisonItem: Array<{
        keyword: string;
        geo: string;
        time: string;
      }>;
      category: number;
      property: string;
    };
    token: string;
  }>;
};

export interface InterestByRegionOptions {
  keyword: string | string[];
  startTime?: Date;
  endTime?: Date;
  geo?: string | string[];
  resolution?: 'COUNTRY' | 'REGION' | 'CITY' | 'DMA';
  hl?: string;
  timezone?: number;
  category?: number;
}

export interface InterestByRegionData {
  geoCode: string;
  geoName: string;
  value: number[];
  formattedValue: string[];
  maxValueIndex: number;
  hasData: boolean[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface InterestByRegionResponse {
  default: {
    geoMapData: InterestByRegionData[];
  };
}

export interface GoogleTrendsError extends Error {
  code: string;
  statusCode?: number;
  details?: unknown;
}

export type GoogleTrendsResponse<T> =
  | {
      data: T;
      error?: never;
    }
  | {
      data?: never;
      error: GoogleTrendsError;
    };

export type GoogleTrendsType = 'trends' | 'articles' | 'interest';
