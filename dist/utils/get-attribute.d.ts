import { ElementHandle, JSHandle } from 'puppeteer';
declare function getAttribute(elementHandle: ElementHandle | JSHandle | null | undefined, attribute?: string): Promise<string | undefined>;
export default getAttribute;
