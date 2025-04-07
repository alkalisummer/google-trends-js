import { DailyTrendingTopics, DailyTrendingTopicsOptions, GoogleTrendsEndpoints, RealTimeTrendsOptions, ExploreOptions, ExploreResponse, InterestByRegionOptions, InterestByRegionResponse } from '../types/index';
import { request } from './request';
import { extractJsonFromResponse } from './format';
import { GOOGLE_TRENDS_MAPPER } from '../constants';

export class GoogleTrendsApi {
  async autocomplete(keyword: string, hl: string = 'en-US'): Promise<string[]> {
    if(!keyword) {
      return []
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.autocomplete],
      qs: {
        hl,
        tz: '240'
      }
    };

    console.log('Autocomplete options:', options);
    try {
      const response = await request(`${options.url}/${encodeURIComponent(keyword)}`, options);
      const text = await response.text();
      console.log('Autocomplete response:', text);
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return data.default.topics.map((topic: { title: string }) => topic.title);
    } catch (error) {
      console.error('Autocomplete request failed:', error);
      return [];
    }
  }

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

  async explore({ keyword, geo = 'US', time = 'today 12-m', category = 0, property = '', hl = 'en-US' }: ExploreOptions): Promise<ExploreResponse> {
    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.explore],
      qs: {
        hl,
        tz: '240',
        req: JSON.stringify({
          comparisonItem: [{
            keyword,
            geo,
            time
          }],
          category,
          property
        })
      }
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      console.log('Explore response:', text);
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return data;
    } catch (error) {
      console.error('Explore request failed:', error);
      return { widgets: [] };
    }
  }

  async interestByRegion({ 
    keyword, 
    geo = 'US', 
    time = 'today 12-m', 
    resolution = 'REGION',
    hl = 'en-US',
  }: InterestByRegionOptions): Promise<InterestByRegionResponse> {
    // First get the widget token from explore
    const exploreResponse = await this.explore({ keyword, geo, time, hl });
    const widget = exploreResponse.widgets.find(w => w.id === 'GEO_MAP_0');
    
    if (!widget) {
      return { default: { geoMapData: [] } };
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.interestByRegion],
      qs: {
        hl,
        tz: '240',
        req: JSON.stringify({
          geo: { country: geo },
          comparisonItem: [{
            time,
            complexKeywordsRestriction: {
              keyword: [{
                type: 'BROAD',
                value: keyword
              }]
            }
          }],
          resolution,
          locale: hl,
          requestOptions: {
            property: '',
            backend: 'IZG',
            category: 0
          },
          userConfig: {
            userType: 'USER_TYPE_SCRAPER'
          }
        }),
        token: widget.token
      }
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return data;
    } catch (error) {
      console.error('Interest by region request failed:', error);
      return { default: { geoMapData: [] } };
    }
  }
}

export default new GoogleTrendsApi();
