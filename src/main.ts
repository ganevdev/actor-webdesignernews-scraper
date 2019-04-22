import Apify from 'apify';
import normalizeUrl from 'normalize-url';
import { Page } from 'puppeteer';

import genUrls from './gen-urls';
import scrapLastPageNumber from './scrap-last-page-number';
import scrapPosts from './scrap-posts';

/**
 *
 * Modified version of default apify gotoFunction
 * https://github.com/apifytech/apify-js/blob/master/src/puppeteer_crawler.js#L9
 */
async function gotoFunctionModified({
  page,
  request
}: {
  page: Page;
  request: any;
}): Promise<void> {
  // setRequestInterception - wish this we can ignore some content on page
  // https://pptr.dev/#?product=Puppeteer&version=v1.14.0&show=api-pagesetrequestinterceptionvalue
  await page.setRequestInterception(true);
  //
  page.on(
    'request',
    (intercepted): void => {
      const ignoredTypes = [
        'stylesheet',
        'image',
        'media',
        'font',
        'script',
        'texttrack',
        'xhr',
        'fetch',
        'eventsource',
        'websocket',
        'manifest',
        'other'
      ];
      const resourceType = intercepted.resourceType();
      if (ignoredTypes.includes(resourceType)) {
        intercepted.abort();
      } else {
        intercepted.continue();
      }
    }
  );
  await Apify.utils.puppeteer.hideWebDriver(page);
  const userAgent = Apify.utils.getRandomUserAgent();
  await page.setUserAgent(userAgent);
  await page.goto(request.url, { timeout: 101000 });
}

/**
 *  Create urls from start url
 *
 */
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
      //
      const request = await new Apify.Request({
        url: input.startUrl
      });
      await gotoFunctionModified({ page, request });
      //
      const lastPageNumber = await scrapLastPageNumber(page);
      //
      const genUrlsArray = genUrls(input.startUrl, lastPageNumber);
      if (genUrlsArray) {
        return genUrlsArray;
      } else {
        throw new Error('unable to create a array of urls to download');
      }
    }
  } catch (error) {
    throw new Error(error);
  }
}

Apify.main(
  async (): Promise<void> => {
    const inputRaw = await Apify.getValue('INPUT');
    //
    if (!inputRaw.startUrl)
      throw new Error('Attribute startUrl missing in input.');
    if (typeof inputRaw.startUrl !== 'string') {
      throw new TypeError('input.startUrl must an string!');
    }
    if (!/.*webdesignernews\.com.*/.test(inputRaw.startUrl))
      throw new Error('input.startUrl not a webdesignernews.com !');
    //
    const startUrlNorm = normalizeUrl(inputRaw.startUrl, { forceHttps: true });
    const input = Object.assign(inputRaw, { startUrl: startUrlNorm });

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
        : 100,
      maxConcurrency: input.maxConcurrency ? input.maxConcurrency : 3,
      //
      // from
      // https://github.com/VaclavRut/actor-amazon-crawler/blob/master/src/main.js
      // This page is executed for each request.
      // Parameter page is Puppeteers page object with loaded page.
      gotoFunction: async ({
        request,
        page
      }: {
        page: Page;
        request: any;
      }): Promise<void> => {
        await gotoFunctionModified({ page, request });
      },
      //
      launchPuppeteerFunction: async (): Promise<void> =>
        Apify.launchPuppeteer({
          headless: input.headless ? input.headless : false,
          useApifyProxy:
            input.proxyConfiguration && input.proxyConfiguration.useApifyProxy
              ? input.proxyConfiguration.useApifyProxy
              : false,
          userAgent: await Apify.utils.getRandomUserAgent(),
          liveView: input.liveView ? input.liveView : false
        }),
      //
      handlePageFunction: async ({
        page,
        request
      }: {
        page: Page;
        request: any;
      }): Promise<void> => {
        // added delay not to crawl too fast
        await page.waitFor(Math.floor(Math.random() * 5000) + 1000);
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
