"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_max_1 = __importDefault(require("lodash.max"));
async function scrapLastPageNumber(pageMain) {
    const paginationAllNumbers = await pageMain.evaluate(() => {
        const pagination = document.querySelector('div[id="pagination-wrap"] > nav[class="pagination"]');
        if (pagination) {
            const paginationAll = [...pagination.querySelectorAll('*')];
            return paginationAll
                .map((att) => Number(att.textContent))
                .filter(Boolean);
        }
    });
    return lodash_max_1.default(paginationAllNumbers);
}
exports.default = scrapLastPageNumber;
