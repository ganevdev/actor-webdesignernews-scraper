import { ElementHandle, JSHandle } from 'puppeteer';
declare function getAttribute(element: ElementHandle | JSHandle | null | undefined, attribute?: string): Promise<string | undefined>;
export default getAttribute;
