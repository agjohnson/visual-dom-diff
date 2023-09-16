"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const diff = tslib_1.__importStar(require("./diff"));
const index = tslib_1.__importStar(require("./index"));
test('exports visualDomDiff', () => {
    expect(index.visualDomDiff).toBe(diff.visualDomDiff);
});
