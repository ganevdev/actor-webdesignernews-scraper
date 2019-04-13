"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apify_1 = __importDefault(require("apify"));
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
            const content = await page.content();
            await apify_1.default.pushData({
                title: title,
                url: request.url,
                content: content
            });
        },
        handleFailedRequestFunction: async ({ request }) => {
            await apify_1.default.pushData({
                '#debug': apify_1.default.utils.createRequestDebugInfo(request)
            });
        },
        maxRequestRetries: input.maxRequestRetries || 5,
        maxRequestsPerCrawl: 10000,
        maxConcurrency: 1
    });
    await crawler.run();
});
