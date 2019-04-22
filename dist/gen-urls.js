"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_range_1 = __importDefault(require("lodash.range"));
const normalize_url_1 = __importDefault(require("normalize-url"));
function makePageUrls(url, number) {
    return { url: url + number };
}
function pageRangeNumbers(page, lastPageNumber) {
    if (lastPageNumber) {
        return lodash_range_1.default(page, lastPageNumber + 1);
    }
    else {
        return lodash_range_1.default(1, page + 1);
    }
}
function pageNormUrl(url) {
    const normalizedUrl = normalize_url_1.default(url, { forceHttps: true });
    if (/\/page\//.test(normalizedUrl)) {
        return normalizedUrl;
    }
    else {
        return normalizedUrl + '/page/1';
    }
}
function genUrls(url, lastPageNumber) {
    const normUrl = pageNormUrl(url);
    const pageNumberArray = /(?<=\/page\/).*/.exec(normUrl);
    if (pageNumberArray && pageNumberArray[0] !== null) {
        const noPageNumberUrl = normUrl.replace(/(?<=\/page\/).*/, '');
        const pageNumbersArray = pageRangeNumbers(Number(pageNumberArray[0]), lastPageNumber);
        return pageNumbersArray.map((number) => {
            return makePageUrls(noPageNumberUrl, number);
        });
    }
}
exports.default = genUrls;
