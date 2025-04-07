import { GoogleTrendsEndpoints, GoogleTrendsMapper } from "./types";

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
    }
  },
  [GoogleTrendsEndpoints.autocomplete]: {
    path: '/trends/api/autocomplete',
    method: 'GET',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/autocomplete`,
    headers: {
      'accept': 'application/json, text/plain, */*'
    }
  },
  [GoogleTrendsEndpoints.explore]: {
    path: '/trends/api/explore',
    method: 'GET',
    host: GOOGLE_TRENDS_BASE_URL,
    url: `https://${GOOGLE_TRENDS_BASE_URL}/trends/api/explore`,
    headers: {
      'Cookie': 'NID=523=SKjL8cZqZCxCPZSsWCX-m7nxNo0xQLd4IAgNLQKryTos5nl57_QkJPK0VFanhUAn9Njc7_agcTr4GiMwgx2-LtNkjsSa5ykRiGT8Jd_hyZpip8r5Y0KNq_78rJJTVy8q1ErQwGKRmLGwewB-gkvlSXf7FtgXPNrjYwnx5YvlJiiDGtOAv8UZf-aP1ZMXFi7GAtHXStg'
    }
  }
};
