import jsdom from 'jsdom';
import max from 'lodash/fp/max';

// take the last page number from page body

const { JSDOM } = jsdom;

export default function lastPageNumber(content: string): number {
  const pagination = new JSDOM(content).window.document.querySelector(
    'div[id="pagination-wrap"] > nav[class="pagination"]'
  );
  const paginationAllNumbers = [...pagination.querySelectorAll('*')].map(
    (att: { textContent: string }): number => Number(att.textContent)
  );
  return max(paginationAllNumbers);
}
