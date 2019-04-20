# actor-webdesignernews-scraper

[![Build Status](https://travis-ci.com/Ganevru/actor-webdesignernews-scraper.svg?branch=master)](https://travis-ci.com/Ganevru/actor-webdesignernews-scraper)

Scraper for www.webdesignernews.com, using Apify.

## Input settings

Only `startUrl` required, by default `https://www.webdesignernews.com`.

`wayToScrape` can be `old` or `new`, by default `old`. If, for example, the starting link is on the third page (`https://webdesignernews.com/page/3` for example), then scraper will scrape the third page, then the fourth page, fifth and so on. But if the `wayToScrape` is `new`, then the third page will be scraped, then the second, and then the first.

## Local use

It is not necessary to use the [apify.com](https://apify.com) service to use actor. Copy this repository, for example, this way:

```
git clone git@github.com:Ganevru/actor-webdesignernews-scraper.git
```

Create folder and file `INPUT.json` in the root of project: `apify_storage/key_value_stores/default/INPUT.json`

In `INPUT.json`, write your settings, for example:

```json
{
  "startUrl": "https://webdesignernews.com/page/3",
  "wayToScrape": "old",
  "maxRequestsPerCrawl": 3,
  "maxRequestRetries": 3,
  "maxConcurrency": 3,
  "liveView": true,
  "proxyConfiguration": {
    "useApifyProxy": false
  }
}
```

Start scrapping with command:

```
npm run local-start
```

Or, if you need a clean start:

```
npm run local-start-fresh
```

This will remove the results of all previous launches!

The result of the launch will be in `apify_storage/datasets/default`

It will be something like this:

```json
{
  "title": "AMP Pages Fundamentally Changing How the Web Works",
  "vote": 47,
  "thumb": "https://webdesignernews.s3.amazonaws.com/post_images/2657750/vlcsnap-2019-04-17-00h58m00s057-728x407-1d95-140x112.jpg",
  "link": "https://www.webdesignernews.com/redirect/id/2657750",
  "source": "androidpolice.com",
  "date": "2 days ago",
  "requestUrl": "https://webdesignernews.com/page/3"
}
```