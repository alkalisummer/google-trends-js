import GoogleTrendsApi from '../index';

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

    it('should return trending topics for different language', async () => {
      const resultEn = await GoogleTrendsApi.dailyTrends({ geo: 'GB' });
      expect(resultEn).toBeDefined();
      const result = await GoogleTrendsApi.dailyTrends({ geo: 'GB', lang: 'fr' });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
      expect(result).not.toBe(resultEn);
    });

    it('should work with not params', async () => {
      const result = await GoogleTrendsApi.dailyTrends({});
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });

    it('should handle errors gracefully', async () => {
      const result = await GoogleTrendsApi.dailyTrends({
        geo: 'INVALID_GEO',
      });
      expect(result).toEqual({
        allTrendingStories: [],
        summary: [],
      });
    });
  });

  describe('realTimeTrends', () => {
    it('should return realtime trends', async () => {
      const result = await GoogleTrendsApi.realTimeTrends({
        geo: 'US',
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });

    it('should return realtime trernds for different 4 hours', async () => {
      const result = await GoogleTrendsApi.realTimeTrends({
        geo: 'US',
        trendingHours: 4,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });

    it('should return realtime trernds for different 2 hours', async () => {
      const result = await GoogleTrendsApi.realTimeTrends({
        geo: 'US',
        trendingHours: 1,
      });
      expect(result).toBeDefined();
      expect(result).toHaveProperty('allTrendingStories');
      expect(result).toHaveProperty('summary');
    });
  });

  describe('autocomplete', () => {
    it('should return autocomplete suggestions for a keyword', async () => {
      const result = await GoogleTrendsApi.autocomplete('bitcoin');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(typeof result[0]).toBe('string');
    });

    it('should return autocomplete suggestions for different language', async () => {
      const result = await GoogleTrendsApi.autocomplete('bitcoin', 'fr-ch');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty keyword', async () => {
      const result = await GoogleTrendsApi.autocomplete('');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should handle special characters in keyword', async () => {
      const result = await GoogleTrendsApi.autocomplete('bitcoin & ethereum');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle non-ASCII characters', async () => {
      const result = await GoogleTrendsApi.autocomplete('ビットコイン', 'zh-cn');
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('interestByRegion', () => {
    // it('should return interest data for a single keyword and region', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: 'Stock Market',
    //     geo: 'US',
    //     resolution: 'REGION'
    //   });
      
    //   expect(result).toBeDefined();
    //   expect(result).toHaveProperty('default');
    //   expect(result.default).toHaveProperty('geoMapData');
    //   expect(Array.isArray(result.default.geoMapData)).toBe(true);
    //   expect(result.default.geoMapData.length).toBeGreaterThan(0);
      
    //   // Check structure of first item
    //   const firstItem = result.default.geoMapData[0];
    //   expect(firstItem).toHaveProperty('geoCode');
    //   expect(firstItem).toHaveProperty('geoName');
    //   expect(firstItem).toHaveProperty('value');
    //   expect(firstItem).toHaveProperty('formattedValue');
    //   expect(firstItem).toHaveProperty('maxValueIndex');
    //   expect(firstItem).toHaveProperty('hasData');
    // });

    // it('should handle multiple keywords and regions', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: ['wine', 'peanuts'],
    //     geo: ['US-CA', 'US-VA'],
    //     resolution: 'CITY'
    //   });
      
    //   expect(result).toBeDefined();
    //   expect(result.default.geoMapData.length).toBeGreaterThan(0);
    // });

    // it('should handle custom date range', async () => {
    //   const startTime = new Date('2023-01-01');
    //   const endTime = new Date('2023-12-31');
      
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: 'Bitcoin',
    //     startTime,
    //     endTime,
    //     geo: 'US'
    //   });
      
    //   expect(result).toBeDefined();
    //   expect(result.default.geoMapData.length).toBeGreaterThan(0);
    // });

    // it('should handle different resolutions', async () => {
    //   const resolutions = ['COUNTRY', 'REGION', 'CITY', 'DMA'] as const;
      
    //   for (const resolution of resolutions) {
    //     const result = await GoogleTrendsApi.interestByRegion({ 
    //       keyword: 'Bitcoin',
    //       geo: 'US',
    //       resolution
    //     });
        
    //     expect(result).toBeDefined();
    //     expect(result.default.geoMapData.length).toBeGreaterThan(0);
    //   }
    // });

    // it('should handle different timezones', async () => {
    //   const timezones = [-240, 0, 240]; // UTC-4, UTC, UTC+4
      
    //   for (const timezone of timezones) {
    //     const result = await GoogleTrendsApi.interestByRegion({ 
    //       keyword: 'Bitcoin',
    //       geo: 'US',
    //       timezone
    //     });
        
    //     expect(result).toBeDefined();
    //     expect(result.default.geoMapData.length).toBeGreaterThan(0);
    //   }
    // });

    // it('should handle different categories', async () => {
    //   const categories = [0, 7, 22]; // All categories, Business, Finance
      
    //   for (const category of categories) {
    //     const result = await GoogleTrendsApi.interestByRegion({ 
    //       keyword: 'Bitcoin',
    //       geo: 'US',
    //       category
    //     });
        
    //     expect(result).toBeDefined();
    //     expect(result.default.geoMapData.length).toBeGreaterThan(0);
    //   }
    // });

    // it('should handle different languages', async () => {
    //   const languages = ['en-US', 'es', 'fr', 'de'];
      
    //   for (const hl of languages) {
    //     const result = await GoogleTrendsApi.interestByRegion({ 
    //       keyword: 'Bitcoin',
    //       geo: 'US',
    //       hl
    //     });
        
    //     expect(result).toBeDefined();
    //     expect(result.default.geoMapData.length).toBeGreaterThan(0);
    //   }
    // });

    // it('should handle empty or invalid parameters gracefully', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: '',
    //     geo: 'INVALID_GEO'
    //   });
      
    //   expect(result).toBeDefined();
    //   expect(result.default.geoMapData).toEqual([]);
    // });

    // it('should include coordinates when available', async () => {
    //   const result = await GoogleTrendsApi.interestByRegion({ 
    //     keyword: 'Bitcoin',
    //     geo: 'US',
    //     resolution: 'CITY'
    //   });
      
    //   const itemWithCoords = result.default.geoMapData.find(item => item.coordinates);
    //   if (itemWithCoords) {
    //     expect(itemWithCoords.coordinates).toHaveProperty('lat');
    //     expect(itemWithCoords.coordinates).toHaveProperty('lng');
    //     expect(typeof itemWithCoords.coordinates?.lat).toBe('number');
    //     expect(typeof itemWithCoords.coordinates?.lng).toBe('number');
    //   }
    // });
  });
});
