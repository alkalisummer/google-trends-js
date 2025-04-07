import GoogleTrendsApi from '../index';
import { GoogleTrendsTrendingHours } from '../types';

describe('GoogleTrendsApi', () => {
  describe('dailyTrends', () => {
    // it('should return trending topics with default parameters', async () => {
    //   const result = await GoogleTrendsApi.dailyTrends({ geo: 'US' });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    //   expect(Array.isArray(result.allTrendingStories)).toBe(true);
    //   expect(Array.isArray(result.summary)).toBe(true);
    // });

    // it('should return trending topics for different geo locations', async () => {
    //   const result = await GoogleTrendsApi.dailyTrends({ geo: 'GB' });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    // });

    // it('should return trending topics for different language', async () => {
    //   const resultEn = await GoogleTrendsApi.dailyTrends({ geo: 'GB' });
    //   expect(resultEn).toBeDefined();
    //   const result = await GoogleTrendsApi.dailyTrends({ geo: 'GB', lang:"fr" });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    //   expect(result).not.toBe(resultEn)
    // });

    // it('should work with not params', async () => {
    //   const result = await GoogleTrendsApi.dailyTrends({});
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    // });

    // it('should handle errors gracefully', async () => {
    //   const result = await GoogleTrendsApi.dailyTrends({
    //     geo: 'INVALID_GEO'
    //   });
    //   expect(result).toEqual({
    //     allTrendingStories: [],
    //     summary: []
    //   });
    // });

  });

  describe('realTimeTrends', () => {
    // it('should return realtime trends', async () => {
    //   const result = await GoogleTrendsApi.realTimeTrends({
    //     geo: 'US'
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    // });

    // it('should return realtime trernds for different 4 hours', async () => {
    //   const result = await GoogleTrendsApi.realTimeTrends({
    //     geo: 'US',
    //     trendingHours: 4
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    // });

    // it('should return realtime trernds for different 2 hours', async () => {
    //   const result = await GoogleTrendsApi.realTimeTrends({
    //     geo: 'US',
    //     trendingHours: 1
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('allTrendingStories');
    //   expect(result).toHaveProperty('summary');
    // });
  });

  describe('autocomplete', () => {
    // it('should return autocomplete suggestions for a keyword', async () => {
    //   const result = await GoogleTrendsApi.autocomplete('bitcoin');
    //   expect(result).toBeDefined();
    //   expect(Array.isArray(result)).toBe(true);
    //   expect(result.length).toBeGreaterThan(0);
    //   expect(typeof result[0]).toBe('string');
    // });

    // it('should return autocomplete suggestions for different language', async () => {
    //   const result = await GoogleTrendsApi.autocomplete('bitcoin', 'fr-ch');
    //   expect(result).toBeDefined();
    //   expect(Array.isArray(result)).toBe(true);
    //   expect(result.length).toBeGreaterThan(0);
    // });

    // it('should handle empty keyword', async () => {
    //   const result = await GoogleTrendsApi.autocomplete('');
    //   expect(result).toBeDefined();
    //   expect(Array.isArray(result)).toBe(true);
    //   expect(result.length).toBe(0);
    // });

    // it('should handle special characters in keyword', async () => {
    //   const result = await GoogleTrendsApi.autocomplete('bitcoin & ethereum');
    //   expect(result).toBeDefined();
    //   expect(Array.isArray(result)).toBe(true);
    // });

    // it('should handle non-ASCII characters', async () => {
    //   const result = await GoogleTrendsApi.autocomplete('ビットコイン', 'zh-cn');
    //   expect(result).toBeDefined();
    //   expect(Array.isArray(result)).toBe(true);
    // });
  });

  describe('interestByRegion', () => {
    it('should return interest by region data for a keyword', async () => {
      const result = await GoogleTrendsApi.interestByRegion({ 
        keyword: 'Stock Market',
        geo: 'US'
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('default');
      expect(result.default).toHaveProperty('geoMapData');
      expect(Array.isArray(result.default.geoMapData)).toBe(true);
      expect(result.default.geoMapData.length).toBeGreaterThan(0);
      expect(result.default.geoMapData[0]).toHaveProperty('geoCode');
      expect(result.default.geoMapData[0]).toHaveProperty('geoName');
      expect(result.default.geoMapData[0]).toHaveProperty('value');
    });

    // it('should return interest by region data for different geo location', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: 'Stock Market',
    //     geo: 'GB'
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('default');
    //   expect(result.default).toHaveProperty('geoMapData');
    //   expect(Array.isArray(result.default.geoMapData)).toBe(true);
    // });

    // it('should return interest by region data for different resolution', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: 'Stock Market',
    //     geo: 'US',
    //     resolution: 'CITY'
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('default');
    //   expect(result.default).toHaveProperty('geoMapData');
    //   expect(Array.isArray(result.default.geoMapData)).toBe(true);
    // });

    // it('should handle empty keyword', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: '',
    //     geo: 'US'
    //   });
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('default');
    //   expect(result.default).toHaveProperty('geoMapData');
    //   expect(Array.isArray(result.default.geoMapData)).toBe(true);
    // });
  });
});
