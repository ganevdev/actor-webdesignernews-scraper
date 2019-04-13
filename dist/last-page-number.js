'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jsdom_1 = __importDefault(require('jsdom'));
const max_1 = __importDefault(require('lodash/fp/max'));
const { JSDOM } = jsdom_1.default;
function lastPageNumber(content) {
  const pagination = new JSDOM(content).window.document.querySelector(
    'div[id="pagination-wrap"] > nav[class="pagination"]'
  );
  if (pagination) {
    const paginationAll = [...pagination.querySelectorAll('*')];
    const paginationAllNumbers = paginationAll
      .map((att) => Number(att.textContent))
      .filter(Boolean);
    const paginationMax = max_1.default(paginationAllNumbers);
    if (paginationMax) {
      return paginationMax;
    } else {
      return 1;
    }
  } else {
    return 1;
  }
}
exports.default = lastPageNumber;
