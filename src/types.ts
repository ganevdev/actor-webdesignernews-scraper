interface Post {
  title?: string;
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
  maxConcurrency?: number;
  liveView?: boolean;
  proxyConfiguration?: {
    useApifyProxy?: boolean;
  };
  headless?: boolean;
}
