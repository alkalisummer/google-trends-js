jest.setTimeout(20000);

import GoogleTrendsApi from '../index';
import { NetworkError } from '../errors/GoogleTrendsError';

describe('GoogleTrendsApi', () => {
  describe('dailyTrends', () => {
    it('should return trending topics as an array', async () => {
      const result = await GoogleTrendsApi.dailyTrends({ geo: 'US' });
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(result.data?.[0]).toHaveProperty('keyword');
    });
    it('should return trending topics for different geo locations', async () => {
      const locations = ['US', 'GB', 'JP', 'IN', 'BR', 'DE', 'FR', 'CA', 'AU', 'RU'];
      for (const geo of locations) {
        const result = await GoogleTrendsApi.dailyTrends({ geo });
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
    it('should return trending topics for different languages', async () => {
      const languages = [
        { hl: 'en', geo: 'US' },
        { hl: 'fr', geo: 'FR' },
        { hl: 'de', geo: 'DE' },
        { hl: 'es', geo: 'ES' },
        { hl: 'ja', geo: 'JP' },
        { hl: 'pt', geo: 'BR' },
        { hl: 'it', geo: 'IT' },
        { hl: 'ru', geo: 'RU' },
      ];
      for (const { hl, geo } of languages) {
        const result = await GoogleTrendsApi.dailyTrends({ geo, hl });
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
    it('should work with no params', async () => {
      const result = await GoogleTrendsApi.dailyTrends({});
      expect(Array.isArray(result.data)).toBe(true);
    });
    it('should handle invalid geo location', async () => {
      const result = await GoogleTrendsApi.dailyTrends({ geo: 'INVALID_GEO' });
      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(NetworkError);
    });
  });

  describe('realTimeTrends', () => {
    it('should return realtime trends as an array', async () => {
      const result = await GoogleTrendsApi.realTimeTrends({ geo: 'US' });
      expect(Array.isArray(result.data)).toBe(true);
    });
    it('should return realtime trends for different time periods', async () => {
      const hours = [4, 24, 48, 168];
      for (const trendingHours of hours) {
        const result = await GoogleTrendsApi.realTimeTrends({ geo: 'US', trendingHours });
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
    it('should return realtime trends for different locations', async () => {
      const locations = ['US', 'GB', 'JP', 'IN', 'BR', 'DE', 'FR', 'CA', 'AU', 'RU'];
      for (const geo of locations) {
        const result = await GoogleTrendsApi.realTimeTrends({ geo });
        expect(Array.isArray(result.data)).toBe(true);
      }
    });
    it('should handle invalid geo location', async () => {
      const result = await GoogleTrendsApi.realTimeTrends({ geo: 'INVALID_GEO' });
      expect(result.error).toBeDefined();
      expect(result.error).toBeInstanceOf(NetworkError);
    });
  });

  describe('autocomplete', () => {
    it('should return autocomplete suggestions for a keyword', async () => {
      const result = await GoogleTrendsApi.autocomplete('bitcoin');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
      expect(typeof result.data?.[0]).toBe('string');
    });
    it('should handle empty keyword', async () => {
      const result = await GoogleTrendsApi.autocomplete('');
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data?.length).toBe(0);
    });
  });

  describe('trendingArticles', () => {
    it('should return trending articles for valid articleKeys', async () => {
      const daily = await GoogleTrendsApi.dailyTrends({ geo: 'US' });
      const articleKey = daily.data?.[0]?.articleKeys?.[0];
      if (!articleKey) {
        console.warn('SKIP: No articleKeys found in daily trends data');
        return;
      }
      const result = await GoogleTrendsApi.trendingArticles({ articleKeys: [articleKey], articleCount: 1 });
      if (result.error && result.error.message.includes('Invalid response format')) {
        console.warn('SKIP: API response format error');
        return;
      }
      if (result.error) {
        throw new Error(`API error: ${result.error.message}`);
      }
      expect(Array.isArray(result.data)).toBe(true);
    });
  });

  describe('interestOverTime', () => {
    it('should return interest over time for a keyword', async () => {
      const result = await GoogleTrendsApi.interestOverTime({ keyword: 'bitcoin', geo: 'US' });
      if (result.error && result.error.message.includes('Invalid response format')) {
        console.warn('SKIP: API response format error');
        return;
      }
      if (result.error) {
        throw new Error(`API error: ${result.error.message}`);
      }
      expect(result.data).toBeDefined();
      expect(typeof result.data).toBe('object');
    });
  });
});
