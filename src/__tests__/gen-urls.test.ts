import genUrls from '../gen-urls';

describe('gen-urls', () => {
  test('genUrls main page', () => {
    const urlsArray = genUrls('https://webdesignernews.com');
    expect(urlsArray).toEqual([{ url: 'https://webdesignernews.com/page/1' }]);
  });
  test('genUrls main page to new', () => {
    const urlsArray = genUrls('https://webdesignernews.com/page/3');
    expect(urlsArray).toEqual([
      { url: 'https://webdesignernews.com/page/1' },
      { url: 'https://webdesignernews.com/page/2' },
      { url: 'https://webdesignernews.com/page/3' }
    ]);
  });
  test('genUrls main page to old', () => {
    const urlsArray = genUrls('https://webdesignernews.com', 3);
    expect(urlsArray).toEqual([
      { url: 'https://webdesignernews.com/page/1' },
      { url: 'https://webdesignernews.com/page/2' },
      { url: 'https://webdesignernews.com/page/3' }
    ]);
  });
  //
  test('genUrls design page', () => {
    const urlsArray = genUrls('https://webdesignernews.com/category/design');
    expect(urlsArray).toEqual([
      { url: 'https://webdesignernews.com/category/design/page/1' }
    ]);
  });
  test('genUrls design page to new', () => {
    const urlsArray = genUrls(
      'https://webdesignernews.com/category/design/page/3'
    );
    expect(urlsArray).toEqual([
      { url: 'https://webdesignernews.com/category/design/page/1' },
      { url: 'https://webdesignernews.com/category/design/page/2' },
      { url: 'https://webdesignernews.com/category/design/page/3' }
    ]);
  });
  test('genUrls design page to old', () => {
    const urlsArray = genUrls('https://webdesignernews.com/category/design', 3);
    expect(urlsArray).toEqual([
      { url: 'https://webdesignernews.com/category/design/page/1' },
      { url: 'https://webdesignernews.com/category/design/page/2' },
      { url: 'https://webdesignernews.com/category/design/page/3' }
    ]);
  });
});
