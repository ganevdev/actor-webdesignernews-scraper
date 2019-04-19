import scrapLastPageNumber from '../scrap-last-page-number';
import filePage from '../utils/file-page';

describe('scrap-last-page-number', () => {
  test('scrapLastPageNumber() https://www.webdesignernews.com', async () => {
    await page.goto(filePage('www.webdesignernews.com.html'));
    expect(await scrapLastPageNumber(page)).toEqual(1513);
  });
  test('scrapLastPageNumber() https://www.webdesignernews.com/category/infographics', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/infographics.html')
    );
    expect(await scrapLastPageNumber(page)).toEqual(8);
  });
  test('scrapLastPageNumber() https://www.webdesignernews.com/category/offbeat/page/41', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/offbeat/page/41.html')
    );
    expect(await scrapLastPageNumber(page)).toEqual(41);
  });
});
