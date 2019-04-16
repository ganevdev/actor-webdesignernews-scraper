import Apify from 'apify';
import { ElementHandle } from 'puppeteer';

import lastPageNumber from './last-page-number';

async function getAttribute(
  element: ElementHandle,
  attribute
): Promise<string> {
  try {
    const property = await element.getProperty(attribute);
    return (await property.jsonValue()).trim();
  } catch (error) {
    return '';
  }
}

async function getText(element: ElementHandle): Promise<string> {
  return getAttribute(element, 'textContent');
}

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
        // const content = await page.content();
        const test = await getText(
          await page.$('div[id="post-rows-block-latest"]')
        );
        const lastPage = await lastPageNumber(page);
        await Apify.pushData({
          title: title,
          url: request.url,
          lastPage: lastPage,
          test: test.trim()
        });
      },
      handleFailedRequestFunction: async ({ request }): Promise<void> => {
        await Apify.pushData({
          '#debug': Apify.utils.createRequestDebugInfo(request)
        });
      },
      maxRequestRetries: input.maxRequestRetries || 3,
      maxRequestsPerCrawl: 10000,
      maxConcurrency: 1
    });

    await crawler.run();
  }
);
