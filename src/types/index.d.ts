export type GoogleTrendsMapper = {
    path: string;
    method: string;
    host: string;
    url: string;
    headers: Record<string, string>;
};

export const enum GoogleTrendsEndpoints {
    dailyTrends = "dailyTrends",
    autocomplete = "autocomplete",
    explore = "explore",
    interestByRegion = "interestByRegion"
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
    lang?: string;
}

export type DailyTrendingTopics = {
    allTrendingStories: unknown[];
    summary: string[];
}

// Real Time Trends

export type RealTimeTrendsOptions = {
    geo: string;
    trendingHours?: number;
}

// Explore

export type ExploreOptions = {
    keyword: string;
    geo?: string;
    time?: string;
    category?: number;
    property?: string;
    hl?: string;
}

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
}

export interface InterestByRegionOptions {
    keyword: string;
    geo?: string;
    time?: string;
    resolution?: 'COUNTRY' | 'REGION' | 'CITY' | 'DMA';
    hl?: string;
}

export interface InterestByRegionData {
    geoCode: string;
    geoName: string;
    value: number[];
    formattedValue: string[];
    maxValueIndex: number;
    hasData: boolean[];
}

export interface InterestByRegionResponse {
    default: {
        geoMapData: InterestByRegionData[];
    };
}