(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.optionsToConfig = void 0;
    const util_1 = require("./util");
    const skipChildrenMap = new Set();
    skipChildrenMap.add('IMG');
    skipChildrenMap.add('VIDEO');
    skipChildrenMap.add('IFRAME');
    skipChildrenMap.add('OBJECT');
    skipChildrenMap.add('SVG');
    const skipSelfMap = new Set();
    skipSelfMap.add('BDO');
    skipSelfMap.add('BDI');
    skipSelfMap.add('Q');
    skipSelfMap.add('CITE');
    skipSelfMap.add('CODE');
    skipSelfMap.add('DATA');
    skipSelfMap.add('TIME');
    skipSelfMap.add('VAR');
    skipSelfMap.add('DFN');
    skipSelfMap.add('ABBR');
    skipSelfMap.add('STRONG');
    skipSelfMap.add('EM');
    skipSelfMap.add('BIG');
    skipSelfMap.add('SMALL');
    skipSelfMap.add('MARK');
    skipSelfMap.add('SUB');
    skipSelfMap.add('SUP');
    skipSelfMap.add('SAMP');
    skipSelfMap.add('KBD');
    skipSelfMap.add('B');
    skipSelfMap.add('I');
    skipSelfMap.add('S');
    skipSelfMap.add('U');
    skipSelfMap.add('SPAN');
    function optionsToConfig({ addedClass = 'vdd-added', modifiedClass = 'vdd-modified', removedClass = 'vdd-removed', skipModified = false, skipChildren, skipSelf, diffText = util_1.diffText, } = {}) {
        return {
            addedClass,
            diffText,
            modifiedClass,
            removedClass,
            skipModified,
            skipChildren(node) {
                if (!util_1.isElement(node) &&
                    !util_1.isDocumentFragment(node) &&
                    !util_1.isDocument(node)) {
                    return true;
                }
                if (skipChildren) {
                    const result = skipChildren(node);
                    if (typeof result === 'boolean') {
                        return result;
                    }
                }
                return skipChildrenMap.has(node.nodeName);
            },
            skipSelf(node) {
                if (!util_1.isText(node) && !util_1.isElement(node)) {
                    return true;
                }
                if (skipSelf) {
                    const result = skipSelf(node);
                    if (typeof result === 'boolean') {
                        return result;
                    }
                }
                return skipSelfMap.has(node.nodeName);
            },
        };
    }
    exports.optionsToConfig = optionsToConfig;
});
