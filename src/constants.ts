export type GoogleTrendsMapper = {
  path: string;
  method: string;
  host: string;
  url: string;
  headers: Record<string, string>;
};

export enum GoogleTrendsEndpoints {
  dailyTrends = 'dailyTrends',
}

const GOOGLE_TRENDS_BASE_URL = 'trends.google.com';

export const GOOGLE_TRENDS_MAPPER: Record<
  GoogleTrendsEndpoints,
  GoogleTrendsMapper
> = {
  [GoogleTrendsEndpoints.dailyTrends]: {
    path: '/_/TrendsUi/data/batchexecute',
    method: 'POST',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/_/TrendsUi/data/batchexecute`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  },
};
