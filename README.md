# @alkalisummer/google-trends-js

This is a TypeScript library that has been updated to incorporate the latest changes to the Google Trends API endpoints. This package provides a simple and type-safe way to access Google Trends data programmatically.

This API was developed based on @shaivpidadi/trends-js with some added and modified features.

## Installation

```bash
npm install @alkalisummer/google-trends-js
```

## Features

- Get daily trending topics
- Get real-time trending topics
- Get articles releated trening topics
- Get autocomplete suggestions
- Explore trends data
- Get interest by region data
- Get interest change timeline by trending topics
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
//     traffic: string;
//     trafficGrowthRate: string;
//     activeTime: string;
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
  keyword: 'bitcoin',
  geo: 'US', // Default: 'US'
});

// Result structure:
// {
//   data?: {
//     keyword: string;
//     dates: string[];
//     values: number[];
//   },
//   error?: GoogleTrendsError
// }
```

### Real-Time Trends

Get real-time trending topics:

```typescript
const result = await GoogleTrendsApi.realTimeTrends({
  geo: 'US', // Default: 'US'
  trendingHours: 4, // Default: 4
});

// Result structure:
// {
//   allTrendingStories: Array<...>,
//   summary: string[]
// }
```

### Autocomplete

Get search suggestions for a keyword:

```typescript
const suggestions = await GoogleTrendsApi.autocomplete(
  'bitcoin', // Keyword to get suggestions for
  'en-US', // Language (default: 'en-US')
);

// Returns: string[]
```

### Explore

Get widget data for a keyword:

```typescript
const result = await GoogleTrendsApi.explore({
  keyword: 'bitcoin',
  geo: 'US', // Default: 'US'
  time: 'today 12-m', // Default: 'today 12-m'
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
  startTime: new Date('2024-01-01'), // Optional - defaults to 2004-01-01
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

### DailyTrendsOptions

```typescript
interface DailyTrendsOptions {
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
  keyword: string;
  geo?: string; // Default: 'US'
  time?: string; // Default: 'today 12-m'
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
  keyword: string; // Required - search term
  geo?: string; // Optional - geocode (default: 'US')
}
```

## Development

### Building

```

```
