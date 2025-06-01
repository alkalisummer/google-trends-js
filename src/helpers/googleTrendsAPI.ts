import {
  DailyTrendingTopicsOptions,
  TrendingArticlesOptions,
  InterestOverTimeOptions,
  GoogleTrendsEndpoints,
  RealTimeTrendsOptions,
  ExploreOptions,
  ExploreResponse,
  InterestByRegionOptions,
  InterestByRegionResponse,
  GoogleTrendsResponse,
  TrendingKeyword,
  ArticleKey,
  Article,
  Interest,
} from '../types/index';
import { request } from './request';
import { extractJsonFromResponse } from './format';
import { GOOGLE_TRENDS_MAPPER } from '../constants';
import { NetworkError, ParseError, UnknownError } from '../errors/GoogleTrendsError';

export class GoogleTrendsApi {
  /**
   * Get autocomplete suggestions for a keyword
   * @param keyword - The keyword to get suggestions for
   * @param lang - Language code (default: 'en-US')
   * @returns Promise with array of suggestion strings
   */
  async autocomplete(keyword: string, lang = 'en-US'): Promise<GoogleTrendsResponse<string[]>> {
    if (!keyword) {
      return { data: [] };
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.autocomplete],
      qs: {
        lang,
        tz: '240',
      },
    };

    try {
      const response = await request(`${options.url}/${encodeURIComponent(keyword)}`, options);
      const text = await response.text();
      // Remove the first 5 characters (JSONP wrapper) and parse
      const data = JSON.parse(text.slice(5));
      return { data: data.default.topics.map((topic: { title: string }) => topic.title) };
    } catch (error) {
      if (error instanceof Error) {
        return { error: new NetworkError(error.message) };
      }
      return { error: new UnknownError() };
    }
  }

  /**
   * Get daily trending topics
   * @param geo - Country code (default: 'US')
   * @param lang - Language code (default: 'en')
   * @returns Promise with trending topics data
   */
  async dailyTrends({
    geo = 'US',
    lang = 'en',
  }: DailyTrendingTopicsOptions): Promise<GoogleTrendsResponse<TrendingKeyword[]>> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"${lang}\\",24,1]",null,"generic"]]]`,
      }).toString(),
      contentType: 'form' as const,
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const trendingTopics = extractJsonFromResponse(text, 'trends') as TrendingKeyword[];

      if (!trendingTopics) {
        return { error: new ParseError() };
      }

      return { data: trendingTopics };
    } catch (error) {
      if (error instanceof Error) {
        return { error: new NetworkError(error.message) };
      }
      return { error: new UnknownError() };
    }
  }

  /**
   * Get real-time trending topics
   * @param geo - Country code (default: 'US')
   * @param trendingHours - Number of hours to get trending topics for (default: 4)
   * @returns Promise with trending topics data
   */
  async realTimeTrends({
    geo = 'US',
    trendingHours = 4,
  }: RealTimeTrendsOptions): Promise<GoogleTrendsResponse<TrendingKeyword[]>> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];

    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["i0OFE","[null,null,\\"${geo}\\",0,\\"en\\",${trendingHours},1]",null,"generic"]]]`,
      }).toString(),
      contentType: 'form' as const,
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const trendingTopics = extractJsonFromResponse(text, 'trends') as TrendingKeyword[];

      if (!trendingTopics) {
        return { error: new ParseError() };
      }

      return { data: trendingTopics };
    } catch (error) {
      if (error instanceof Error) {
        return { error: new NetworkError(error.message) };
      }
      return { error: new UnknownError() };
    }
  }

  /**
   * Get trending articles
   * @param articleKeys - Array of article keys
   * @param articleCount - Number of articles to get
   * @returns Promise with trending articles data
   */
  async trendingArticles({
    articleKeys,
    articleCount,
  }: TrendingArticlesOptions): Promise<GoogleTrendsResponse<Article[]>> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];
    const articleKeysStr = articleKeys
      .map((key: ArticleKey) => `[${key[0]},\\"${key[1]}\\",\\"${key[2]}\\"]`)
      .join(',');
    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["w4opAf","[[${articleKeysStr}],${articleCount}]",null,"generic"]]]`,
      }).toString(),
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const articles = extractJsonFromResponse(text, 'articles') as Article[];

      if (!articles) {
        return { error: new ParseError() };
      }

      return { data: articles };
    } catch (error) {
      if (error instanceof Error) {
        return { error: new NetworkError(error.message) };
      }
      return { error: new UnknownError() };
    }
  }

  /**
   * Get interest over time
   * @param keyword - Keyword to get interest over time for
   * @param geo - Country code (default: 'US')
   * @returns Promise with interest over time data
   */
  async interestOverTime({ keyword, geo }: InterestOverTimeOptions): Promise<GoogleTrendsResponse<Interest>> {
    const defaultOptions = GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.dailyTrends];
    const options = {
      ...defaultOptions,
      body: new URLSearchParams({
        'f.req': `[[["g4kJzf","[[[\\"${geo}\\",\\"${keyword}\\",3,null,3]]]",null,"generic"]]]`,
      }).toString(),
    };

    try {
      const response = await request(options.url, options);
      const text = await response.text();
      const interest = extractJsonFromResponse(text, 'interest') as Interest;

      if (!interest) {
        return { error: new ParseError() };
      }

      return { data: interest };
    } catch (error) {
      if (error instanceof Error) {
        return { error: new NetworkError(error.message) };
      }
      return { error: new UnknownError() };
    }
  }

  /**
   * Get explore data
   * @param keyword - Keyword to get explore data for
   * @param geo - Country code (default: 'US')
   * @param time - Time period for the explore data
   * @param category - Category for the explore data
   * @param property - Property for the explore data
   * @param lang - Language code (default: 'en-US')
   * @returns Promise with explore data
   */
  async explore({
    keyword,
    geo = 'US',
    time = 'now 1-d',
    category = 0,
    property = '',
    lang = 'en-US',
  }: ExploreOptions): Promise<ExploreResponse> {
    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.explore],
      qs: {
        lang,
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
      contentType: 'form' as const,
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

  /**
   * Get interest by region
   * @param keyword - Keyword to get interest by region for
   * @param startTime - Start time for the interest by region
   * @param endTime - End time for the interest by region
   * @param geo - Country code (default: 'US')
   * @param resolution - Resolution for the interest by region
   * @param lang - Language code (default: 'en-US')
   * @param timezone - Timezone offset
   * @param category - Category for the interest by region
   * @returns Promise with interest by region data
   */
  async interestByRegion({
    keyword,
    startTime = new Date('2004-01-01'),
    endTime = new Date(),
    geo = 'US',
    resolution = 'REGION',
    lang = 'en-US',
    timezone = new Date().getTimezoneOffset(),
    category = 0,
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
      lang,
    });

    const widget = exploreResponse.widgets.find((w) => w.id === 'GEO_MAP');

    if (!widget) {
      return { default: { geoMapData: [] } };
    }

    const options = {
      ...GOOGLE_TRENDS_MAPPER[GoogleTrendsEndpoints.interestByRegion],
      qs: {
        lang,
        tz: timezone.toString(),
        req: JSON.stringify({
          geo: {
            country: Array.isArray(geo) ? geo[0] : geo,
          },
          comparisonItem: [
            {
              time: `${formatDate(startTime)} ${formatDate(endTime)}`,
              complexKeywordsRestriction: {
                keyword: [
                  {
                    type: 'BROAD', //'ENTITY',
                    value: Array.isArray(keyword) ? keyword[0] : keyword,
                  },
                ],
              },
            },
          ],
          resolution,
          locale: lang,
          requestOptions: {
            property: '',
            backend: 'CM', //'IZG',
            category,
          },
          userConfig: {
            userType: 'USER_TYPE_LEGIT_USER',
          },
        }),
        token: widget.token,
      },
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
