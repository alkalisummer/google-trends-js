import {
  DailyTrendingTopics,
  DailyTrendingTopicsOptions,
  GoogleTrendsEndpoints,
  RealTimeTrendsOptions,
  ExploreOptions,
  ExploreResponse,
  InterestByRegionOptions,
  InterestByRegionResponse,
} from '../types/index';
import { request } from './request';
import { extractJsonFromResponse } from './format';
import { GOOGLE_TRENDS_MAPPER } from '../constants';

export class GoogleTrendsApi {
  async autocomplete(keyword: string, hl = 'en-US'): Promise<string[]> {
    if (!keyword) {
      return [];
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.autocomplete],
      qs: {
        hl,
        tz: '240',
      },
    };

    try {
      const response = await request(`${options.url}/${encodeURIComponent(keyword)}`, options);
      const text = await response.text();
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return data.default.topics.map((topic: { title: string }) => topic.title);
    } catch (error) {
      console.error('Autocomplete request failed:', error);
      return [];
    }
  }

  async dailyTrends({ geo = 'US', lang = 'en' }: DailyTrendingTopicsOptions): Promise<DailyTrendingTopics> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"${lang}\\",24,1]",null,"generic"]]]`,
      }).toString(),
      contentType: 'form' as const
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const trendingTopics = extractJsonFromResponse(text);

      if (!trendingTopics) {
        return {
          allTrendingStories: [],
          summary: [],
        };
      }

      return trendingTopics;
    } catch (error) {
      console.error(error);
      return {
        allTrendingStories: [],
        summary: [],
      };
    }
  }

  async realTimeTrends({ geo = 'US', trendingHours = 4 }: RealTimeTrendsOptions): Promise<DailyTrendingTopics> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"en\\",${trendingHours},1]",null,"generic"]]]`,
      }).toString(),
      contentType: 'form' as const
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const trendingTopics = extractJsonFromResponse(text);

      if (!trendingTopics) {
        return {
          allTrendingStories: [],
          summary: [],
        };
      }

      return trendingTopics;
    } catch (error) {
      console.error(error);
      return {
        allTrendingStories: [],
        summary: [],
      };
    }
  }

  async explore({
    keyword,
    geo = 'US',
    time = 'today 12-m',
    category = 0,
    property = '',
    hl = 'en-US',
  }: ExploreOptions): Promise<ExploreResponse> {
    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.explore],
      qs: {
        hl,
        tz: '240',
        req: JSON.stringify({
          comparisonItem: [
            {
              keyword,
              geo,
              time,
            },
          ],
          category,
          property,
        }),
      },
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return data;
    } catch (error) {
      console.error('Explore request failed:', error);
      return { widgets: [] };
    }
  }

  // 
  async interestByRegion({
    keyword,
    startTime = new Date('2004-01-01'),
    endTime = new Date(),
    geo = 'US',
    resolution = 'REGION',
    hl = 'en-US',
    timezone = new Date().getTimezoneOffset(),
    category = 0
  }: InterestByRegionOptions): Promise<InterestByRegionResponse> {
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    const formatTrendsDate = (date: Date): string => {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const min = pad(date.getMinutes());
      const ss = pad(date.getSeconds());
    
      return `${yyyy}-${mm}-${dd}T${hh}\\:${min}\\:${ss}`;
    };
    
    const getDateRangeParam = (date: Date) => {
      const yesterday = new Date(date);
      yesterday.setDate(date.getDate() - 1);
    
      const formattedStart = formatTrendsDate(yesterday);
      const formattedEnd = formatTrendsDate(date);
    
      return `${formattedStart} ${formattedEnd}`;
    };

    
    const exploreResponse = await this.explore({ 
      keyword: Array.isArray(keyword) ? keyword[0] : keyword,
      geo: Array.isArray(geo) ? geo[0] : geo,
      time: `${getDateRangeParam(startTime)} ${getDateRangeParam(endTime)}`,
      category,
      hl
    });
    
    const widget = exploreResponse.widgets.find(w => w.id === 'GEO_MAP');

    if (!widget) {
      return { default: { geoMapData: [] } };
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.interestByRegion],
      qs: {
        hl,
        tz: timezone.toString(),
        req: JSON.stringify({
          geo: {
            country: Array.isArray(geo) ? geo[0] : geo
          },
          comparisonItem: [{
            time: `${formatDate(startTime)} ${formatDate(endTime)}`,
            complexKeywordsRestriction: {
              keyword: [{
                type: 'BROAD', //'ENTITY',
                value: Array.isArray(keyword) ? keyword[0] : keyword
              }]
            }
          }],
          resolution,
          locale: hl,
          requestOptions: {
            property: '',
            backend: 'CM', //'IZG',
            category
          },
          userConfig: {
            userType: 'USER_TYPE_LEGIT_USER'
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
      return { default: { geoMapData: [] } };
    }
  }
}

export default new GoogleTrendsApi();
