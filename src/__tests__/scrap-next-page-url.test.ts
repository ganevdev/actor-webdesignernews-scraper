import scrapNextPageUrl from '../scrap-next-page-url';
import filePage from '../utils/file-page';

describe('scrap-next-page-url', () => {
  test('scrapNextPageUrl', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/infographics.html')
    );
    const scrapNextPageUrlTest = await scrapNextPageUrl(page);
    expect(scrapNextPageUrlTest).toEqual(
      'https://www.webdesignernews.com/category/infographics/page/2'
    );
  });
  test('scrapNextPageUrl page 2', async () => {
    await page.goto(filePage('www.webdesignernews.com.html'));
    const scrapNextPageUrlTest = await scrapNextPageUrl(page);
    expect(scrapNextPageUrlTest).toEqual(
      'https://www.webdesignernews.com/page/2'
    );
  });
  test('scrapNextPageUrl 1517 - last page, need undefined', async () => {
    await page.goto(filePage('www.webdesignernews.com/page/1517.html'));
    const scrapNextPageUrlTest = await scrapNextPageUrl(page);
    expect(scrapNextPageUrlTest).toEqual(undefined);
  });
});
