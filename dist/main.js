"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
const normalize_url_1 = __importDefault(require("normalize-url"));
const gen_urls_1 = __importDefault(require("./gen-urls"));
const scrap_last_page_number_1 = __importDefault(require("./scrap-last-page-number"));
const scrap_posts_1 = __importDefault(require("./scrap-posts"));
async function gotoFunctionModified({ page, request }) {
    await page.setRequestInterception(true);
    page.on('request', (intercepted) => {
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
        }
        else {
            intercepted.continue();
        }
    });
    await apify_1.default.utils.puppeteer.hideWebDriver(page);
    const userAgent = apify_1.default.utils.getRandomUserAgent();
    await page.setUserAgent(userAgent);
    await page.goto(request.url, { timeout: 100000 });
}
async function genUrlArray(input) {
    try {
        if (input.wayToScrape && input.wayToScrape === 'new') {
            const genUrlsArray = gen_urls_1.default(input.startUrl);
            if (genUrlsArray) {
                return genUrlsArray;
            }
        }
        else {
            const browser = await apify_1.default.launchPuppeteer();
            const page = await browser.newPage();
            const request = await new apify_1.default.Request({
                url: input.startUrl
            });
            await gotoFunctionModified({ page, request });
            const lastPageNumber = await scrap_last_page_number_1.default(page);
            const genUrlsArray = gen_urls_1.default(input.startUrl, lastPageNumber);
            if (genUrlsArray) {
                return genUrlsArray;
            }
            else {
                throw new Error('unable to create a array of urls to download');
            }
        }
    }
    catch (error) {
        throw new Error(error);
    }
}
apify_1.default.main(async () => {
    const inputRaw = await apify_1.default.getValue('INPUT');
    if (!inputRaw.startUrl)
        throw new Error('Attribute startUrl missing in input.');
    if (typeof inputRaw.startUrl !== 'string') {
        throw new TypeError('input.startUrl must an string!');
    }
    if (!/.*webdesignernews\.com.*/.test(inputRaw.startUrl))
        throw new Error('input.startUrl not a webdesignernews.com !');
    const startUrlNorm = normalize_url_1.default(inputRaw.startUrl, { forceHttps: true });
    const input = Object.assign(inputRaw, { startUrl: startUrlNorm });
    const urlArray = await genUrlArray(input);
    if (!urlArray)
        throw new Error('unable to create a array of urls to download');
    const requestList = new apify_1.default.RequestList({
        sources: urlArray
    });
    await requestList.initialize();
    const crawler = new apify_1.default.PuppeteerCrawler({
        requestList,
        maxRequestRetries: input.maxRequestRetries ? input.maxRequestRetries : 3,
        maxRequestsPerCrawl: input.maxRequestsPerCrawl
            ? input.maxRequestsPerCrawl
            : 100,
        maxConcurrency: input.maxConcurrency ? input.maxConcurrency : 3,
        gotoFunction: async ({ request, page }) => {
            await gotoFunctionModified({ page, request });
        },
        launchPuppeteerFunction: async () => apify_1.default.launchPuppeteer({
            headless: input.headless ? input.headless : false,
            useApifyProxy: input.proxyConfiguration && input.proxyConfiguration.useApifyProxy
                ? input.proxyConfiguration.useApifyProxy
                : false,
            userAgent: await apify_1.default.utils.getRandomUserAgent(),
            liveView: input.liveView ? input.liveView : false
        }),
        handlePageFunction: async ({ page, request }) => {
            await page.waitFor(Math.floor(Math.random() * 5000) + 1000);
            const pagePosts = await scrap_posts_1.default(page);
            const pagePostsFinal = pagePosts.map((post) => Object.assign(post, { requestUrl: request.url }));
            await apify_1.default.pushData(pagePostsFinal);
        },
        handleFailedRequestFunction: async ({ request }) => {
            await apify_1.default.pushData({
                '#debug': apify_1.default.utils.createRequestDebugInfo(request)
            });
        }
    });
    await crawler.run();
});
