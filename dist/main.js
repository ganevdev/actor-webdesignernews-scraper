"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
const last_page_number_1 = __importDefault(require("./last-page-number"));
async function getAttribute(element, attribute) {
    try {
        const property = await element.getProperty(attribute);
        return (await property.jsonValue()).trim();
    }
    catch (error) {
        return '';
    }
}
async function getText(element) {
    return getAttribute(element, 'textContent');
}
apify_1.default.main(async () => {
    const input = await apify_1.default.getValue('INPUT');
    if (!input.url)
        throw new Error('Attribute url missing in input.');
    const requestQueue = await apify_1.default.openRequestQueue();
    await requestQueue.addRequest({ url: input.url });
    const crawler = new apify_1.default.PuppeteerCrawler({
        requestQueue,
        handlePageFunction: async ({ request, page }) => {
            const title = await page.title();
            const test = await getText(await page.$('div[id="post-rows-block-latest"]'));
            const lastPage = await last_page_number_1.default(page);
            await apify_1.default.pushData({
                title: title,
                url: request.url,
                lastPage: lastPage,
                test: test.trim()
            });
        },
        handleFailedRequestFunction: async ({ request }) => {
            await apify_1.default.pushData({
                '#debug': apify_1.default.utils.createRequestDebugInfo(request)
            });
        },
        maxRequestRetries: input.maxRequestRetries || 3,
        maxRequestsPerCrawl: 10000,
        maxConcurrency: 1
    });
    await crawler.run();
});
