# @alkalisummer/google-trends-js

This is a TypeScript library that has been updated to incorporate the latest changes to the Google Trends API endpoints. This package provides a simple and type-safe way to access Google Trends data programmatically.

This API was developed based on @shaivpidadi/trends-js with some added and modified features. 

The following changes and additions have been made:
- Daily Trends : Added relatedKeywords and activeTime.
- Trending Articles : Retrieves information about articles related to trending keywords.
- Interest Over Time : Retrieves time-series interest data for trending keywords.

## Installation

```bash
npm install @alkalisummer/google-trends-js
```

## Features

- Get daily trending topics
- Get real-time trending topics
- Get articles related to trending topics
- Get autocomplete suggestions
- Explore trends data
- Get interest by region data
- Get interest over time (timeline) for keywords
- TypeScript support
- Promise-based API

## Usage

### Importing

```typescript
import GoogleTrendsApi from '@alkalisummer/google-trends-js';
```

### Daily Trends

Get daily trending topics for a specific region:

```typescript
const result = await GoogleTrendsApi.dailyTrends({
  geo: 'US', // Default: 'US'
  hl: 'en', // Default: 'en'
});

// Result structure:
// {
//   data?: Array<{
//     keyword: string;
//     traffic: number;
//     trafficGrowthRate: number;
//     activeTime: Date;
//     relatedKeywords: string[];
//     articleKeys: ArticleKey[];
//   }>,
//   error?: GoogleTrendsError
// }
//
```

### Trending Articles

Get trending articles for specific article keys

You can retrieve articleKeys from the articleKeys field in the response returned by the dailyTrends method.

```typescript
const result = await GoogleTrendsApi.trendingArticles({
  articleKeys: [[1, hl, geo]], // Array of article keys
  articleCount: 5, // Number of articles to get
});

// Result structure:
// {
//   data?: Array<{
//     title: string;
//     link: string;
//     mediaCompany: string;
//     pressDate: number[];
//     image: string;
//   }>,
//   error?: GoogleTrendsError
// }
```

### Interest Over Time

Get interest over time data for a specific keyword:

```typescript
const result = await GoogleTrendsApi.interestOverTime({
  keyword: 'bitcoin', // or an array of keywords
  geo: 'US', //Default: 'US'
  period: 'now 7-d', // Default: 'now 1-d'
  hl: 'en-US', // Default: 'en-US'
});

// Result structure:
// {
//   data?: {
//     keyword: string | string[];
//     dates: Date[];
//     values: number[][]; // one series per keyword (for single keyword: a single inner array)
//   },
//   error?: GoogleTrendsError
// }
```

Multiple keywords example:

```typescript
const result = await GoogleTrendsApi.interestOverTime({
  keyword: ['bitcoin', 'ethereum'],
  geo: 'US',
  period: 'today 12-m',
});

if (result.data) {
  // result.data.values is number[][] where
  // values[i] corresponds to the i-th sorted date in result.data.dates
}
```

### Real-Time Trends

Get real-time trending topics:

```typescript
const result = await GoogleTrendsApi.realTimeTrends({
  geo: 'US', // Default: 'US'
  trendingHours: 4, // Default: 4
});

// Result structure (wrapped):
// {
//   data?: Array<{
//     keyword: string;
//     traffic: number;
//     trafficGrowthRate: number;
//     activeTime: Date;
//     relatedKeywords: string[];
//     articleKeys: ArticleKey[];
//   }>,
//   error?: GoogleTrendsError
// }
```

### Autocomplete

Get search suggestions for a keyword:

```typescript
const suggestions = await GoogleTrendsApi.autocomplete(
  'bitcoin', // Keyword to get suggestions for
  'en-US', // Language (default: 'en-US')
);

if (suggestions.data) {
  // suggestions.data is string[]
}
```

### Explore

Get widget data for a keyword:

```typescript
const result = await GoogleTrendsApi.explore({
  keyword: 'bitcoin',
  geo: 'US', // Default: 'US'
  time: '2025-06-30 2025-07-01', // Default: 'now 1-d'
  category: 0, // Default: 0
  property: '', // Default: ''
  hl: 'en-US', // Default: 'en-US'
});

// Result structure:
// {
//   widgets: Array<{
//     id: string,
//     request: {...},
//     token: string
//   }>
// }
```

### Interest by Region

Get interest data by region:

```typescript
const result = await GoogleTrendsApi.interestByRegion({
  keyword: 'Stock Market', // Required - string or string[]
  startTime: new Date('2024-01-01'), // Optional - defaults: yesterday
  endTime: new Date(), // Optional - defaults to current date
  geo: 'US', // Optional - string or string[] - defaults to 'US'
  resolution: 'REGION', // Optional - 'COUNTRY' | 'REGION' | 'CITY' | 'DMA'
  hl: 'en-US', // Optional - defaults to 'en-US'
  timezone: -240, // Optional - defaults to local timezone
  category: 0, // Optional - defaults to 0
});

// Result structure:
// {
//   default: {
//     geoMapData: Array<{
//       geoCode: string,
//       geoName: string,
//       value: number[],
//       formattedValue: string[],
//       maxValueIndex: number,
//       hasData: boolean[],
//       coordinates?: {
//         lat: number,
//         lng: number
//       }
//     }>
//   }
// }
```

Example with multiple keywords and regions:

```typescript
const result = await GoogleTrendsApi.interestByRegion({
  keyword: ['wine', 'peanuts'],
  geo: ['US-CA', 'US-VA'],
  startTime: new Date('2024-01-01'),
  endTime: new Date(),
  resolution: 'CITY',
});
```

## API Reference

### DailyTrendingTopicsOptions

```typescript
interface DailyTrendingTopicsOptions {
  geo?: string; // Default: 'US'
  hl?: string; // Default: 'en'
}
```

### RealTimeTrendsOptions

```typescript
interface RealTimeTrendsOptions {
  geo: string;
  trendingHours?: number; // Default: 4
}
```

### ExploreOptions

```typescript
interface ExploreOptions {
  keyword: string | string[];
  geo?: string; // Default: 'US'
  time?: string; // Default: 'now 1-d'
  category?: number; // Default: 0
  property?: string; // Default: ''
  hl?: string; // Default: 'en-US'
}
```

### InterestByRegionOptions

```typescript
interface InterestByRegionOptions {
  keyword: string | string[]; // Required - search term(s)
  startTime?: Date; // Optional - start date
  endTime?: Date; // Optional - end date
  geo?: string | string[]; // Optional - geocode(s)
  resolution?: 'COUNTRY' | 'REGION' | 'CITY' | 'DMA'; // Optional
  hl?: string; // Optional - language code
  timezone?: number; // Optional - timezone offset
  category?: number; // Optional - category number
}
```

### TrendingArticlesOptions

```typescript
interface TrendingArticlesOptions {
  articleKeys: ArticleKey[]; // Required - array of article keys
  articleCount: number; // Required - number of articles to get
}

type ArticleKey = [number, string, string]; // [index, lang, geo]
```

### InterestOverTimeOptions

```typescript
interface InterestOverTimeOptions {
  keyword: string | string[]; // Required - search term(s)
  geo?: string; // Optional - geocode (default: 'US')
  period?: 'now 1-H' | 'now 4-H' | 'now 1-d' | 'now 7-d' | 'now 1-m' | 'today 3-m' | 'today 12-m' | 'today 5-y'; // Optional - time period (default: 'now 1-d')
  hl?: string; // Optional - language (default: 'en-US')
}
```

## Development

### Building

```

```
