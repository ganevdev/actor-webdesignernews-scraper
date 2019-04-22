"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getAttribute(elementHandle, attribute = 'textContent') {
    if (elementHandle) {
        try {
            const property = await elementHandle.getProperty(attribute);
            if (property) {
                return (await property.jsonValue()).trim();
            }
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
