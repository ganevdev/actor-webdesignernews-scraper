import jsdom from 'jsdom';
import max from 'lodash/fp/max';

// take the last page number from page body, return number

const { JSDOM } = jsdom;

export default function lastPageNumber(content: string): number {
  const pagination = new JSDOM(content).window.document.querySelector(
    'div[id="pagination-wrap"] > nav[class="pagination"]'
  );
  if (pagination) {
    const paginationAll = [...pagination.querySelectorAll('*')];
    const paginationAllNumbers = paginationAll
      .map((att: Element): number => Number(att.textContent))
      .filter(Boolean);
    const paginationMax = max(paginationAllNumbers);
    if (paginationMax) {
      return paginationMax;
    } else {
      return 1;
    }
  } else {
    return 1;
  }
}
