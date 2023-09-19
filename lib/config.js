import { diffText as diffTextDefault, isDocument, isDocumentFragment, isElement, isText, } from './util';
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
export function optionsToConfig({ addedClass = 'vdd-added', modifiedClass = 'vdd-modified', removedClass = 'vdd-removed', skipModified = false, skipChildren, skipSelf, diffText = diffTextDefault, } = {}) {
    return {
        addedClass,
        diffText,
        modifiedClass,
        removedClass,
        skipModified,
        skipChildren(node) {
            if (!isElement(node) &&
                !isDocumentFragment(node) &&
                !isDocument(node)) {
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
            if (!isText(node) && !isElement(node)) {
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
