"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getAttribute(element, attribute = 'textContent') {
    if (element) {
        try {
            const property = await element.getProperty(attribute);
            return (await property.jsonValue()).trim();
        }
        catch (error) {
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
exports.default = getAttribute;
