interface Post {
  title: string;
  vote?: number;
  thumb?: string;
  link?: string;
  source?: string;
  date?: string;
  requestUrl?: string;
}

interface Input {
  startUrl: string;
  wayToScrape?: string;
  maxRequestsPerCrawl?: number;
  maxRequestRetries?: number;
  liveView?: boolean;
}