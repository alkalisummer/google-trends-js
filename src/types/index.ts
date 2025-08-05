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
  geo: string;
}

export interface Interest {
  keyword: string;
  dates: Date[];
  values: number[];
}

export type InterestTrend = [number, number, number[]];

export interface DailyTrendingTopics {
  allTrendingStories: TrendingStory[];
  summary: TrendingKeyword[];
}

// Real Time Trends

export type RealTimeTrendsOptions = {
  geo: string;
  trendingHours?: number;
};

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
