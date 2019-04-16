import scrapPosts from '../scrap-posts';
import filePage from '../utils/file-page';

describe('scrap-posts', () => {
  test('scrapPosts()', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/infographics.html')
    );
    const scrapPostsTest = await scrapPosts(page);
    expect(scrapPostsTest[0]).toEqual({
      title: 'Inspiring Desktop Wallpapers to Welcome 2018 (January Edition)',
      vote: 76,
      thumb:
        'file:///Users/ivanganev/project/ganevru/webdesignernews-scraper/src/__mockData__/www.webdesignernews.com/category/Infographics%20news%20-%20WebdesignerNews_files/jan-18-january-is-the-month-for-dreaming-preview-opt-1713-140x112.png',
      link: 'https://www.webdesignernews.com/redirect/id/1800166'
    });
  });
});
