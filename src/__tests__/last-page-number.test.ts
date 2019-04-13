import jsonfile from 'jsonfile';

import lastPageNumber from '../last-page-number';

const webdesignernewsInfographics = jsonfile.readFileSync(
  __dirname + '/webdesignernews-infographics.json'
);

describe('last-page-number', () => {
  test('lastPageNumber()', () => {
    const lastPageNumberTest = lastPageNumber(
      webdesignernewsInfographics.content
    );
    expect(lastPageNumberTest).toEqual(8);
  });
});
