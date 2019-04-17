import scrapPosts from '../scrap-posts';
import filePage from '../utils/file-page';

describe('scrap-posts', () => {
  test('scrapPosts()', async () => {
    await page.goto(
      filePage('www.webdesignernews.com/category/infographics.html')
    );
    const scrapPostsTest = await scrapPosts(page);
    expect(scrapPostsTest[0].title).toEqual(
      'Inspiring Desktop Wallpapers to Welcome 2018 (January Edition)'
    );
    expect(scrapPostsTest[0].vote).toEqual(76);
    expect(scrapPostsTest[0].link).toEqual(
      'https://www.webdesignernews.com/redirect/id/1800166'
    );
    expect(scrapPostsTest[0].source).toEqual('smashingmagazine.com');
    expect(scrapPostsTest[0].thumb).toMatch(
      /jan-18-january-is-the-month-for-dreaming-preview-opt-1713-140x112.png/
    );
    expect(scrapPostsTest[0].date).toEqual('1 years ago');
    expect(scrapPostsTest[0].page).toEqual(1);
  });
});
