import { ElementHandle, JSHandle } from 'puppeteer';

async function getAttribute(
  element: ElementHandle | JSHandle | null | undefined,
  attribute: string = 'textContent'
): Promise<string | undefined> {
  if (element) {
    try {
      const property: JSHandle = await element.getProperty(attribute);
      return (await property.jsonValue()).trim();
    } catch (error) {
      return undefined;
    }
  } else {
    return undefined;
  }
}

export default getAttribute;
