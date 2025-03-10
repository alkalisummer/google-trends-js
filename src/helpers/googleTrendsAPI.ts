import { DailyTrendingTopics, DailyTrendingTopicsOptions, GoogleTrendsEndpoints } from '../types/index';
import { request } from './request';
import { extractJsonFromResponse } from './format';
import { GOOGLE_TRENDS_MAPPER } from '../constants';

export class GoogleTrendsApi {
  async dailyTrends({ geo = "US", trendingHours = 24 }: DailyTrendingTopicsOptions): Promise<DailyTrendingTopics> {
    const defaultOptions =
      GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req':
          `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"en\\",${trendingHours},1]",null,"generic"]]]`,
      }).toString(),
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const trendingTopics = extractJsonFromResponse(text);

      if (!trendingTopics) {
        return {
          allTrendingStories: [],
          summary: [],
        }
      }

      return trendingTopics;
    } catch (error) {
      console.error(error);
      return {
        allTrendingStories: [],
        summary: [],
      }
    }

  }
}

export default new GoogleTrendsApi();
