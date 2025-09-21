import { GoogleTrendsEndpoints, GoogleTrendsMapper } from './types';

const GOOGLE_TRENDS_BASE_URL = 'trends.google.com';

export const GOOGLE_TRENDS_MAPPER: Record<GoogleTrendsEndpoints, GoogleTrendsMapper> = {
  [GoogleTrendsEndpoints.dailyTrends]: {
    path: '/_/TrendsUi/data/batchexecute',
    method: 'POST',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/_/TrendsUi/data/batchexecute`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    },
  },
  [GoogleTrendsEndpoints.autocomplete]: {
    path: '/trends/api/autocomplete',
    method: 'GET',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/autocomplete`,
    headers: {
      accept: 'application/json, text/plain, */*',
    },
  },
  [GoogleTrendsEndpoints.explore]: {
    path: '/trends/api/explore',
    method: 'POST',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/explore`,
    headers: {
      accept: ' */*',
    },
  },
  [GoogleTrendsEndpoints.interestByRegion]: {
    path: '/trends/api/widgetdata/comparedgeo',
    method: 'GET',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/widgetdata/comparedgeo`,
    headers: {
      accept: 'application/json, text/plain, */*',
    },
  },
  [GoogleTrendsEndpoints.interestOverTime]: {
    path: '/trends/api/widgetdata/multiline',
    method: 'GET',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/widgetdata/multiline`,
    headers: {
      accept: '*/*',
    },
  },
};
