import GoogleTrendsApi from '../index';

describe('Valid Google Trends API', () => {
  describe('GoogleTrendsApi', () => {
    it('should return a string containing the message', async () => {
      const result = await GoogleTrendsApi.getTrendingTopics();
      console.log(result);
      expect(result).toBeDefined();
    });
  });
});
