import lastPageNumber from '../last-page-number';
import filePage from '../utils/file-page';

describe('last-page-number', () => {
  test('lastPageNumber() https://www.webdesignernews.com', async () => {
    await page.goto(filePage('www.webdesignernews.com.html'));
    expect(await lastPageNumber(page)).toEqual(1513);
  });
  test('lastPageNumber() https://www.webdesignernews.com/category/infographics', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/infographics.html')
    );
    expect(await lastPageNumber(page)).toEqual(8);
  });
  test('lastPageNumber() https://www.webdesignernews.com/category/offbeat/page/41', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/offbeat/page/41.html')
    );
    expect(await lastPageNumber(page)).toEqual(41);
  });
});
