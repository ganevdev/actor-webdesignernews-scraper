import scrapPosts from '../scrap-posts';
import filePage from '../utils/file-page';

describe('scrap-posts', () => {
  test('scrapPosts() infographics page', async () => {
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
  });
  test('scrapPosts() 1517 page', async () => {
    await page.goto(filePage('www.webdesignernews.com/page/1517.html'));
    const scrapPostsTest = await scrapPosts(page);
    expect(scrapPostsTest[0].title).toEqual(
      'Affinity Designer Gets First Big Update'
    );
    expect(scrapPostsTest[0].vote).toEqual(-61);
    expect(scrapPostsTest[0].link).toEqual(
      'https://www.webdesignernews.com/redirect/id/2157'
    );
    expect(scrapPostsTest[0].source).toEqual('creativebloq.com');
    expect(scrapPostsTest[0].thumb).toMatch(
      /one-point-2-prime-69c3-140x112.jpg/
    );
    expect(scrapPostsTest[0].date).toEqual('4 yearss ago');
  });
});
