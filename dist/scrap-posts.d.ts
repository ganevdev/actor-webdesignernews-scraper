import { Page } from 'puppeteer';
export default function scrapPosts(page: Page): Promise<(Post | undefined)[]>;
