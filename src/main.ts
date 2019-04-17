import Apify from 'apify';

import scrapPosts from './scrap-posts';

Apify.main(
  async (): Promise<void> => {
    const input = await Apify.getValue('INPUT');
    //
    if (!input.startUrl)
      throw new Error('Attribute startUrl missing in input.');
    if (typeof input.startUrl !== 'string') {
      throw new TypeError('input.startUrl must an string!');
    }
    //

    // Create RequestQueue
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: input.startUrl });

    const crawler = new Apify.PuppeteerCrawler({
      requestQueue,
      //
      maxRequestRetries: input.maxRequestRetries || 3,
      maxRequestsPerCrawl: 10000,
      maxConcurrency: 1,
      //
      launchPuppeteerFunction: async (): Promise<void> =>
        Apify.launchPuppeteer({
          headless: true,
          userAgent: await Apify.utils.getRandomUserAgent(),
          liveView: input.liveView ? input.liveView : true
        }),
      //
      handlePageFunction: async ({ page }): Promise<void> => {
        const pagePosts = await scrapPosts(page);
        await Apify.pushData(pagePosts);
      },
      handleFailedRequestFunction: async ({ request }): Promise<void> => {
        await Apify.pushData({
          '#debug': Apify.utils.createRequestDebugInfo(request)
        });
      }
    });

    await crawler.run();
  }
);
