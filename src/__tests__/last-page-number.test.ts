import jsonfile from 'jsonfile';

import lastPageNumber from '../last-page-number';

const webdesignernewsInfographics = jsonfile.readFileSync(
  __dirname + '/webdesignernews-infographics.json'
);
const webdesignernewsMain = jsonfile.readFileSync(
  __dirname + '/webdesignernews-main.json'
);
const webdesignernewsOffbeat41 = jsonfile.readFileSync(
  __dirname + '/webdesignernews-offbeat-41.json'
);

describe('last-page-number', () => {
  test('lastPageNumber() https://www.webdesignernews.com/category/infographics', () => {
    expect(lastPageNumber(webdesignernewsInfographics.content)).toEqual(8);
  });
  test('lastPageNumber() https://www.webdesignernews.com', () => {
    expect(lastPageNumber(webdesignernewsMain.content)).toEqual(1513);
  });
  test('lastPageNumber() https://www.webdesignernews.com/category/offbeat/page/41', () => {
    expect(lastPageNumber(webdesignernewsOffbeat41.content)).toEqual(41);
  });
});
