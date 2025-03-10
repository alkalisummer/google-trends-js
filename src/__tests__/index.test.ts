import GoogleTrendsApi from '../index';
import { GoogleTrendsTrendingHours } from '../types';

describe('GoogleTrendsApi', () => {
  describe('dailyTrends', () => {
    it('should return trending topics with default parameters', async () => {
      const result = await GoogleTrendsApi.dailyTrends({ geo: 'US' });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
      expect(Array.isArray(result.allTrendingStories)).toBe(true);
      expect(Array.isArray(result.summary)).toBe(true);
    });

    it('should return trending topics for different geo locations', async () => {
      const result = await GoogleTrendsApi.dailyTrends({ geo: 'GB' });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });

    it('should return trending topics for different time ranges', async () => {
      const result = await GoogleTrendsApi.dailyTrends({
        geo: 'US',
        trendingHours: GoogleTrendsTrendingHours.fourHrs
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });

    it('should handle errors gracefully', async () => {
      const result = await GoogleTrendsApi.dailyTrends({
        geo: 'INVALID_GEO'
      });
      expect(result).toEqual({
        allTrendingStories: [],
        summary: []
      });
    });

    it('should return trending topics for seven days', async () => {
      const result = await GoogleTrendsApi.dailyTrends({
        geo: 'US',
        trendingHours: GoogleTrendsTrendingHours.sevenDays
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });
  });
});
