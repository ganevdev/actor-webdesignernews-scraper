import { Page } from 'puppeteer';
interface Post {
    title: string;
    vote?: number;
    thumb?: string;
    link?: string;
}
export default function scrapPosts(page: Page): Promise<(Post | undefined)[] | undefined>;
export {};
