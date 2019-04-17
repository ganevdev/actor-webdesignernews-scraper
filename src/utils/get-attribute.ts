import { ElementHandle, JSHandle } from 'puppeteer';

async function getAttribute(
  elementHandle: ElementHandle | JSHandle | null | undefined,
  attribute: string = 'textContent'
): Promise<string | undefined> {
  if (elementHandle) {
    try {
      const property: JSHandle = await elementHandle.getProperty(attribute);
      if (property) {
        return (await property.jsonValue()).trim();
      }
    } catch (error) {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export default getAttribute;
