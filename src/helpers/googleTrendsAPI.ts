import { DailyTrendingTopics, DailyTrendingTopicsOptions, GoogleTrendsEndpoints, RealTimeTrendsOptions } from '../types/index';
import { request } from './request';
import { extractJsonFromResponse } from './format';
import { GOOGLE_TRENDS_MAPPER } from '../constants';

export class GoogleTrendsApi {
  async dailyTrends({ geo = "US", lang="en" }: DailyTrendingTopicsOptions): Promise<DailyTrendingTopics> {
    const defaultOptions =
      GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req':
          `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"${lang}\\",24,1]",null,"generic"]]]`,
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

  async realTimeTrends({ geo = "US", trendingHours = 4 }: RealTimeTrendsOptions): Promise<DailyTrendingTopics> {
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
