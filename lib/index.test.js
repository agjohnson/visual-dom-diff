(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "tslib", "./diff", "./index"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const tslib_1 = require("tslib");
    const diff = tslib_1.__importStar(require("./diff"));
    const index = tslib_1.__importStar(require("./index"));
    test('exports visualDomDiff', () => {
        expect(index.visualDomDiff).toBe(diff.visualDomDiff);
    });
});
