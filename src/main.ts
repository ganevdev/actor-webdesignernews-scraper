import Apify from 'apify';

Apify.main(
  async (): Promise<void> => {
    const input = await Apify.getValue('INPUT');
    if (!input.url) throw new Error('Attribute url missing in input.');
    //
    const requestQueue = await Apify.openRequestQueue();
    await requestQueue.addRequest({ url: input.url });

    const crawler = new Apify.PuppeteerCrawler({
      requestQueue,
      handlePageFunction: async ({ request, page }): Promise<void> => {
        const title = await page.title();
        const content = await page.content();
        await Apify.pushData({
          title: title,
          url: request.url,
          content: content
        });
      },
      handleFailedRequestFunction: async ({ request }): Promise<void> => {
        await Apify.pushData({
          '#debug': Apify.utils.createRequestDebugInfo(request)
        });
      },
      maxRequestRetries: input.maxRequestRetries || 5,
      maxRequestsPerCrawl: 10000,
      maxConcurrency: 1
    });

    await crawler.run();
  }
);
