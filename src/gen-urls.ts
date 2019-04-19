import range from 'lodash.range';
import normalizeUrl from 'normalize-url';

function makePageUrls(url: string, number: number): { url: string } {
  return { url: url + number };
}

function pageRangeNumbers(page: number, lastPageNumber?: number): number[] {
  if (lastPageNumber) {
    return range(page, lastPageNumber + 1);
  } else {
    return range(1, page + 1);
  }
}

function pageNormUrl(url: string): string {
  const normalizedUrl = normalizeUrl(url, { forceHttps: true });
  if (/\/page\//.test(normalizedUrl)) {
    return normalizedUrl;
  } else {
    return normalizedUrl + '/page/1';
  }
}

export default function genUrls(
  url: string,
  lastPageNumber?: number
): { url: string }[] | undefined {
  const normUrl = pageNormUrl(url);
  const pageNumberArray = /(?<=\/page\/).*/.exec(normUrl);
  if (pageNumberArray && pageNumberArray[0] !== null) {
    const noPageNumberUrl = normUrl.replace(/(?<=\/page\/).*/, '');
    const pageNumbersArray = pageRangeNumbers(
      Number(pageNumberArray[0]),
      lastPageNumber
    );
    return pageNumbersArray.map(
      (number: number): { url: string } => {
        return makePageUrls(noPageNumberUrl, number);
      }
    );
  }
}
