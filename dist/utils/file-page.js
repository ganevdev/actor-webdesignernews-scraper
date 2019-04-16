"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function filePage(fileName) {
    return 'file://' + path_1.default.resolve('./src/__mockData__', fileName);
}
exports.default = filePage;
