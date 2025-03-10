import { GOOGLE_TRENDS_MAPPER, GoogleTrendsEndpoints } from '../constants';
import { request } from './request';
import { extractJsonFromResponse } from './format';

export class GoogleTrendsApi {
  async getTrendingTopics(): Promise<unknown> {
    const defaultOptions =
      GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req':
          '[[["i0OFE","[null,null,\\"US\\",0,\\"en\\",24,1]",null,"generic"]]]',
      }).toString(),
    };


    try {
      const response = await request(options.url, options);
      const text = await response.text();
      return extractJsonFromResponse(text);

    } catch (error) {
      console.error(error);
      return null
    }

  }
}

export default new GoogleTrendsApi();
