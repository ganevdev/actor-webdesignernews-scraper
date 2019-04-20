import Apify from 'apify';

import genUrls from './gen-urls';
import scrapLastPageNumber from './scrap-last-page-number';
import scrapPosts from './scrap-posts';

Apify.main(
  /* eslint-disable sonarjs/cognitive-complexity */
  async (): Promise<void> => {
    const input = await Apify.getValue('INPUT');
    //
    if (!input.startUrl)
      throw new Error('Attribute startUrl missing in input.');
    if (typeof input.startUrl !== 'string') {
      throw new TypeError('input.startUrl must an string!');
    }
    //
    // Create urls from start url
    async function genUrlArray(
      input: Input
    ): Promise<{ url: string }[] | undefined> {
      try {
        if (input.wayToScrape && input.wayToScrape === 'new') {
          const genUrlsArray = genUrls(input.startUrl);
          if (genUrlsArray) {
            return genUrlsArray;
          }
        } else {
          // we do not know which page is the last one - so we need to take this information from the start url page
          const browser = await Apify.launchPuppeteer();
          const page = await browser.newPage();
          await page.goto(input.startUrl);
          const lastPageNumber = await scrapLastPageNumber(page);
          //
          const genUrlsArray = genUrls(input.startUrl, lastPageNumber);
          if (genUrlsArray) {
            return genUrlsArray;
          }
        }
      } catch (error) {
        throw new Error(error);
      }
    }

    const urlArray = await genUrlArray(input);
    if (!urlArray)
      throw new Error('unable to create a array of urls to download');
    const requestList = new Apify.RequestList({
      sources: urlArray
    });
    await requestList.initialize();

    const crawler = new Apify.PuppeteerCrawler({
      requestList,
      //
      maxRequestRetries: input.maxRequestRetries ? input.maxRequestRetries : 3,
      maxRequestsPerCrawl: input.maxRequestsPerCrawl
        ? input.maxRequestsPerCrawl
        : 1000,
      maxConcurrency: input.maxConcurrency ? input.maxConcurrency : 3,
      //
      launchPuppeteerFunction: async (): Promise<void> =>
        Apify.launchPuppeteer({
          headless: true,
          useApifyProxy:
            input.proxyConfiguration && input.proxyConfiguration.useApifyProxy
              ? input.proxyConfiguration.useApifyProxy
              : false,
          userAgent: await Apify.utils.getRandomUserAgent(),
          liveView: input.liveView ? input.liveView : true
        }),
      //
      handlePageFunction: async ({ page, request }): Promise<void> => {
        const pagePosts = await scrapPosts(page);
        const pagePostsFinal = pagePosts.map(
          (post): Post => Object.assign(post, { requestUrl: request.url })
        );
        await Apify.pushData(pagePostsFinal);
      },
      handleFailedRequestFunction: async ({ request }): Promise<void> => {
        await Apify.pushData({
          '#debug': Apify.utils.createRequestDebugInfo(request)
        });
      }
    });
    //
    await crawler.run();
  }
);
