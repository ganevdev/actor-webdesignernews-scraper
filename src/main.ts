import Apify from 'apify';

// import scrapNextPageUrl from './scrap-next-page-url';
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
    // Create urls to scrap

    // Create RequestQueue
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: input.startUrl });

    const crawler = new Apify.PuppeteerCrawler({
      requestQueue,
      //
      maxRequestRetries: input.maxRequestRetries ? input.maxRequestRetries : 3,
      maxRequestsPerCrawl: input.maxRequestsPerCrawl
        ? input.maxRequestsPerCrawl
        : 100,
      maxConcurrency: 1,
      //
      launchPuppeteerFunction: async (): Promise<void> =>
        Apify.launchPuppeteer({
          headless: true,
          userAgent: await Apify.utils.getRandomUserAgent(),
          liveView: input.liveView ? input.liveView : true
        }),
      //
      handlePageFunction: async ({ page, request }): Promise<void> => {
        const pagePosts = await scrapPosts(page);
        // const nextPageUrl = await scrapNextPageUrl(page);
        // if (nextPageUrl) {
        //   await requestQueue.addRequest({
        //     url: nextPageUrl
        //   });
        // }
        // assign requestUrl to awry post
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

    await crawler.run();
  }
);
