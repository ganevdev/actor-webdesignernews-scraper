"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const get_attribute_1 = __importDefault(require("./utils/get-attribute"));
async function postElementToObject(postElement) {
    const title = await get_attribute_1.default(await postElement.$('div[class="post-info"] > h2'));
    const vote = Number(await get_attribute_1.default(await postElement.$('div[class="post-vote-cell"]')));
    const thumb = await get_attribute_1.default(await postElement.$('img[class="post-thumb-img"]'), 'src');
    const link = await get_attribute_1.default(await postElement.$('div[class="post-thumb"] > a'), 'href');
    const source = await get_attribute_1.default(await postElement.$('a[class="site-name-lnk"]'));
    const date = await get_attribute_1.default(await postElement.$('span[class="made-popuplar"]'));
    if (title) {
        return {
            title: title,
            vote: vote,
            thumb: thumb,
            link: link,
            source: source,
            date: date
        };
    }
}
async function scrapPosts(page) {
    const postsBlock = await page.$('div[id="post-rows-block-latest"]');
    if (postsBlock) {
        const divPostsArray = await page.$$('div[class="post-row"]');
        const postsElement = await Promise.all(divPostsArray.map(async (postElement) => {
            const postElementObjects = await postElementToObject(postElement);
            return postElementObjects;
        }));
        const postsElementClean = postsElement.filter(Boolean);
        return postsElementClean;
    }
    else {
        return [];
    }
}
exports.default = scrapPosts;
