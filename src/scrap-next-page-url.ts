import { Page } from 'puppeteer';

import getAttribute from './utils/get-attribute';

export default async function scrapNextPageUrl(
  page: Page
): Promise<string | undefined> {
  const href = await getAttribute(await page.$('a[class="next-btn"]'), 'href');
  if (href) {
    return href;
  }
}
