🚧 WIP: Temporary workaround for [#175](https://github.com/pat310/google-trends-api/issues/175)

# @shaivpidadi/trends-js

A TypeScript library for interacting with the Google Trends API. This package provides a simple and type-safe way to access Google Trends data programmatically.

## Installation

```bash
npm install @shaivpidadi/trends-js
```

## Features

- Get daily trending topics
- Get real-time trending topics
- Get autocomplete suggestions
- Explore trends data
- Get interest by region data
- TypeScript support
- Promise-based API

## Usage

### Importing

```typescript
import GoogleTrendsApi from '@shaivpidadi/trends-js';
```

### Daily Trends

Get daily trending topics for a specific region:

```typescript
const result = await GoogleTrendsApi.dailyTrends({ 
  geo: 'US',  // Default: 'US'
  lang: 'en'  // Default: 'en'
});

// Result structure:
// {
//   allTrendingStories: Array<...>,
//   summary: string[]
// }
```

### Real-Time Trends

Get real-time trending topics:

```typescript
const result = await GoogleTrendsApi.realTimeTrends({ 
  geo: 'US',           // Default: 'US'
  trendingHours: 4     // Default: 4
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
  'bitcoin',           // Keyword to get suggestions for
  'en-US'              // Language (default: 'en-US')
);

// Returns: string[]
```

### Explore

Get widget data for a keyword:

```typescript
const result = await GoogleTrendsApi.explore({ 
  keyword: 'bitcoin',
  geo: 'US',           // Default: 'US'
  time: 'today 12-m',  // Default: 'today 12-m'
  category: 0,         // Default: 0
  property: '',        // Default: ''
  hl: 'en-US'         // Default: 'en-US'
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
  keyword: 'Stock Market',
  geo: 'US',           // Default: 'US'
  time: 'today 12-m',  // Default: 'today 12-m'
  resolution: 'REGION', // Default: 'REGION'
  hl: 'en-US'         // Default: 'en-US'
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
//       hasData: boolean[]
//     }>
//   }
// }
```

## API Reference

### DailyTrendsOptions

```typescript
interface DailyTrendsOptions {
  geo?: string;  // Default: 'US'
  lang?: string; // Default: 'en'
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
  geo?: string;           // Default: 'US'
  time?: string;          // Default: 'today 12-m'
  category?: number;      // Default: 0
  property?: string;      // Default: ''
  hl?: string;           // Default: 'en-US'
}
```

### InterestByRegionOptions

```typescript
interface InterestByRegionOptions {
  keyword: string;
  geo?: string;           // Default: 'US'
  time?: string;          // Default: 'today 12-m'
  resolution?: 'COUNTRY' | 'REGION' | 'CITY' | 'DMA'; // Default: 'REGION'
  hl?: string;           // Default: 'en-US'
}
```

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## License

MIT

## Author

Shaishav Pidadi
