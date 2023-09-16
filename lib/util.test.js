"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const diff_match_patch_1 = require("diff-match-patch");
const jsdom_1 = require("jsdom");
const util_1 = require("./util");
const window = new jsdom_1.JSDOM('').window;
const document = window.document;
const text = document.createTextNode('text');
const identicalText = document.createTextNode('text');
const differentText = document.createTextNode('different text');
const span = document.createElement('SPAN');
const identicalSpan = document.createElement('SPAN');
const differentAttributeNamesSpan = document.createElement('SPAN');
const differentAttributeValuesSpan = document.createElement('SPAN');
const differentChildNodesSpan = document.createElement('SPAN');
const video = document.createElement('VIDEO');
const comment = document.createComment('comment');
const identicalComment = document.createComment('comment');
const differentComment = document.createComment('different comment');
const fragment = document.createDocumentFragment();
const anotherFragment = document.createDocumentFragment();
const pChar = util_1.charForNodeName('P');
const ulChar = util_1.charForNodeName('UL');
const liChar = util_1.charForNodeName('LI');
span.setAttribute('data-a', 'a');
span.setAttribute('data-b', 'b');
identicalSpan.setAttribute('data-b', 'b');
identicalSpan.setAttribute('data-a', 'a');
differentAttributeNamesSpan.setAttribute('data-a', 'a');
differentAttributeNamesSpan.setAttribute('data-b', 'b');
differentAttributeNamesSpan.setAttribute('data-c', 'c');
differentAttributeValuesSpan.setAttribute('data-a', 'different a');
differentAttributeValuesSpan.setAttribute('data-b', 'different b');
differentChildNodesSpan.setAttribute('data-a', 'a');
differentChildNodesSpan.setAttribute('data-b', 'b');
differentChildNodesSpan.appendChild(document.createTextNode('different'));
describe('isText', () => {
    test('return true given a text node', () => {
        expect(util_1.isText(text)).toBe(true);
    });
    test('return false given a SPAN', () => {
        expect(util_1.isText(span)).toBe(false);
    });
    test('return false given a document', () => {
        expect(util_1.isText(document)).toBe(false);
    });
    test('return false given a document fragment', () => {
        expect(util_1.isText(fragment)).toBe(false);
    });
    test('return false given a comment', () => {
        expect(util_1.isText(comment)).toBe(false);
    });
});
describe('isElement', () => {
    test('return false given a text node', () => {
        expect(util_1.isElement(text)).toBe(false);
    });
    test('return true given a SPAN', () => {
        expect(util_1.isElement(span)).toBe(true);
    });
    test('return false given a document', () => {
        expect(util_1.isElement(document)).toBe(false);
    });
    test('return false given a document fragment', () => {
        expect(util_1.isElement(fragment)).toBe(false);
    });
    test('return false given a comment', () => {
        expect(util_1.isElement(comment)).toBe(false);
    });
});
describe('isDocument', () => {
    test('return false given a text node', () => {
        expect(util_1.isDocument(text)).toBe(false);
    });
    test('return false given a SPAN', () => {
        expect(util_1.isDocument(span)).toBe(false);
    });
    test('return true given a document', () => {
        expect(util_1.isDocument(document)).toBe(true);
        expect(util_1.isDocument(new jsdom_1.JSDOM('').window.document)).toBe(true);
    });
    test('return false given a document fragment', () => {
        expect(util_1.isDocument(fragment)).toBe(false);
    });
    test('return false given a comment', () => {
        expect(util_1.isDocument(comment)).toBe(false);
    });
});
describe('isDocumentFragment', () => {
    test('return false given a text node', () => {
        expect(util_1.isDocumentFragment(text)).toBe(false);
    });
    test('return false given a SPAN', () => {
        expect(util_1.isDocumentFragment(span)).toBe(false);
    });
    test('return false given a document', () => {
        expect(util_1.isDocumentFragment(document)).toBe(false);
    });
    test('return true given a document fragment', () => {
        expect(util_1.isDocumentFragment(fragment)).toBe(true);
    });
    test('return false given a comment', () => {
        expect(util_1.isDocumentFragment(comment)).toBe(false);
    });
});
describe('isComment', () => {
    test('return false given a text node', () => {
        expect(util_1.isComment(text)).toBe(false);
    });
    test('return false given a SPAN', () => {
        expect(util_1.isComment(span)).toBe(false);
    });
    test('return false given a document', () => {
        expect(util_1.isComment(document)).toBe(false);
    });
    test('return true given a document fragment', () => {
        expect(util_1.isComment(fragment)).toBe(false);
    });
    test('return true given a comment', () => {
        expect(util_1.isComment(comment)).toBe(true);
    });
});
describe('areArraysEqual', () => {
    describe('default comparator', () => {
        test('empty arrays', () => {
            expect(util_1.areArraysEqual([], [])).toBe(true);
        });
        test('different length', () => {
            expect(util_1.areArraysEqual([1], [1, 2])).toBe(false);
        });
        test('different item types', () => {
            expect(util_1.areArraysEqual([1, 2], [1, '2'])).toBe(false);
        });
        test('identical arrays', () => {
            expect(util_1.areArraysEqual([1, '2', text], [1, '2', text])).toBe(true);
        });
        test('the same nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, text])).toBe(true);
        });
        test('identical nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, identicalText])).toBe(false);
        });
        test('different nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, differentText])).toBe(false);
        });
    });
    describe('node comparator', () => {
        test('the same nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, text], util_1.areNodesEqual)).toBe(true);
        });
        test('identical nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, identicalText], util_1.areNodesEqual)).toBe(true);
        });
        test('different nodes', () => {
            expect(util_1.areArraysEqual([text, text], [text, differentText], util_1.areNodesEqual)).toBe(false);
        });
    });
});
describe.each([
    ['native', window.Element.prototype.getAttributeNames],
    ['undefined', undefined],
])('areNodesEqual (getAttributeNames: %s)', (_, customGetAttributeNames) => {
    const originalGetAttributeNames = window.Element.prototype.getAttributeNames;
    beforeAll(() => {
        window.Element.prototype.getAttributeNames = customGetAttributeNames;
    });
    afterAll(() => {
        window.Element.prototype.getAttributeNames = originalGetAttributeNames;
    });
    describe('shallow', () => {
        test('the same node', () => {
            expect(util_1.areNodesEqual(text, text)).toBe(true);
        });
        test('different node types', () => {
            expect(util_1.areNodesEqual(text, span)).toBe(false);
        });
        test('different node names', () => {
            expect(util_1.areNodesEqual(video, span)).toBe(false);
        });
        test('different comment nodes', () => {
            expect(util_1.areNodesEqual(comment, differentComment)).toBe(false);
        });
        test('identical comment nodes', () => {
            expect(util_1.areNodesEqual(comment, identicalComment)).toBe(true);
        });
        test('different text nodes', () => {
            expect(util_1.areNodesEqual(text, differentText)).toBe(false);
        });
        test('identical text nodes', () => {
            expect(util_1.areNodesEqual(text, identicalText)).toBe(true);
        });
        test('elements with different attribute names', () => {
            expect(util_1.areNodesEqual(span, differentAttributeNamesSpan)).toBe(false);
        });
        test('elements with different attribute values', () => {
            expect(util_1.areNodesEqual(span, differentAttributeValuesSpan)).toBe(false);
        });
        test('elements with different childNodes', () => {
            expect(util_1.areNodesEqual(span, differentChildNodesSpan)).toBe(true);
        });
        test('identical elements', () => {
            expect(util_1.areNodesEqual(span, identicalSpan)).toBe(true);
        });
        test('document fragments', () => {
            expect(util_1.areNodesEqual(fragment, anotherFragment)).toBe(true);
        });
    });
    describe('deep', () => {
        const rootNode = document.createDocumentFragment();
        const div = document.createElement('DIV');
        const p = document.createElement('P');
        const em = document.createElement('EM');
        const strong = document.createElement('STRONG');
        rootNode.append(div, p);
        p.append(em, strong);
        em.textContent = 'em';
        strong.textContent = 'strong';
        test('identical nodes', () => {
            expect(util_1.areNodesEqual(rootNode.cloneNode(true), rootNode.cloneNode(true), true)).toBe(true);
        });
        test('extraneous child', () => {
            const differentRootNode = rootNode.cloneNode(true);
            differentRootNode.lastChild
                .lastChild.appendChild(document.createTextNode('different'));
            expect(util_1.areNodesEqual(rootNode.cloneNode(true), differentRootNode, true)).toBe(false);
        });
        test('child with a different attribute', () => {
            const differentRootNode = rootNode.cloneNode(true);
            differentRootNode.lastChild
                .lastChild.setAttribute('data-a', 'a');
            expect(util_1.areNodesEqual(rootNode.cloneNode(true), differentRootNode, true)).toBe(false);
        });
    });
});
describe('getAncestors', () => {
    const node1 = document.createDocumentFragment();
    const node2 = document.createElement('DIV');
    const node3 = document.createTextNode('test');
    node1.append(node2);
    node2.append(node3);
    const testData = [
        [node1, undefined, []],
        [node2, undefined, [node1]],
        [node3, undefined, [node2, node1]],
        [node1, null, []],
        [node2, null, [node1]],
        [node3, null, [node2, node1]],
        [node1, node1, []],
        [node2, node1, [node1]],
        [node3, node1, [node2, node1]],
        [node1, node2, []],
        [node2, node2, []],
        [node3, node2, [node2]],
        [node1, node3, []],
        [node2, node3, [node1]],
        [node3, node3, []],
    ];
    testData.forEach(([node, rootNode, ancestors]) => {
        test(`node: ${node.nodeName}; root: ${rootNode &&
            rootNode.nodeName}`, () => {
            expect(util_1.getAncestors(node, rootNode)).toStrictEqual(ancestors);
        });
    });
});
describe('never', () => {
    test('default message', () => {
        expect(() => util_1.never()).toThrowError('visual-dom-diff: Should never happen');
    });
    test('custom message', () => {
        expect(() => util_1.never('Custom message')).toThrowError('Custom message');
    });
});
describe('diffText', () => {
    test('empty inputs', () => {
        expect(util_1.diffText('', '')).toStrictEqual([]);
    });
    test('identical inputs', () => {
        expect(util_1.diffText('test', 'test')).toStrictEqual([[diff_match_patch_1.DIFF_EQUAL, 'test']]);
    });
    test('insert into empty', () => {
        expect(util_1.diffText('', 'test')).toStrictEqual([[diff_match_patch_1.DIFF_INSERT, 'test']]);
    });
    test('delete all', () => {
        expect(util_1.diffText('test', '')).toStrictEqual([[diff_match_patch_1.DIFF_DELETE, 'test']]);
    });
    test('different letter case', () => {
        expect(util_1.diffText('test', 'Test')).toStrictEqual([
            [diff_match_patch_1.DIFF_DELETE, 't'],
            [diff_match_patch_1.DIFF_INSERT, 'T'],
            [diff_match_patch_1.DIFF_EQUAL, 'est'],
        ]);
    });
    test('different whitespace', () => {
        expect(util_1.diffText('start  end', 'start     end')).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, 'start  '],
            [diff_match_patch_1.DIFF_INSERT, '   '],
            [diff_match_patch_1.DIFF_EQUAL, 'end'],
        ]);
    });
    test('word added', () => {
        expect(util_1.diffText('start end', 'start add end')).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, 'start '],
            [diff_match_patch_1.DIFF_INSERT, 'add '],
            [diff_match_patch_1.DIFF_EQUAL, 'end'],
        ]);
    });
    test('word removed', () => {
        expect(util_1.diffText('start remove end', 'start end')).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, 'start '],
            [diff_match_patch_1.DIFF_DELETE, 'remove '],
            [diff_match_patch_1.DIFF_EQUAL, 'end'],
        ]);
    });
    test('word replaced', () => {
        expect(util_1.diffText('start remove end', 'start add end')).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, 'start '],
            [diff_match_patch_1.DIFF_DELETE, 'remove'],
            [diff_match_patch_1.DIFF_INSERT, 'add'],
            [diff_match_patch_1.DIFF_EQUAL, ' end'],
        ]);
    });
    test('word added with a node marker', () => {
        expect(util_1.diffText(`${pChar}start${pChar}end`, `${pChar}start${pChar}add${pChar}end`)).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}start`],
            [diff_match_patch_1.DIFF_INSERT, `${pChar}add`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}end`],
        ]);
    });
    test('word removed with a node marker', () => {
        expect(util_1.diffText(`${pChar}start${pChar}remove${pChar}end`, `${pChar}start${pChar}end`)).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}start`],
            [diff_match_patch_1.DIFF_DELETE, `${pChar}remove`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}end`],
        ]);
    });
    test('word replaced in text with node markers', () => {
        expect(util_1.diffText(`${pChar}start${pChar}remove${pChar}end`, `${pChar}start${pChar}add${pChar}end`)).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}start${pChar}`],
            [diff_match_patch_1.DIFF_DELETE, 'remove'],
            [diff_match_patch_1.DIFF_INSERT, 'add'],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}end`],
        ]);
    });
    test('semantic diff', () => {
        expect(util_1.diffText('mouse', 'sofas')).toStrictEqual([
            [diff_match_patch_1.DIFF_DELETE, 'mouse'],
            [diff_match_patch_1.DIFF_INSERT, 'sofas'],
        ]);
    });
    describe('skip node markers when running diff_cleanupSemantic', () => {
        test('equal node markers only', () => {
            expect(util_1.diffText('\uE000\uE001\uE002\uE003', '\uE000\uE001\uE002\uE003')).toStrictEqual([[diff_match_patch_1.DIFF_EQUAL, '\uE000\uE001\uE002\uE003']]);
        });
        test('equal node markers with prefix', () => {
            expect(util_1.diffText('a\uE000\uE001\uE002\uE003', 'a\uE000\uE001\uE002\uE003')).toStrictEqual([[diff_match_patch_1.DIFF_EQUAL, 'a\uE000\uE001\uE002\uE003']]);
        });
        test('equal node markers with suffix', () => {
            expect(util_1.diffText('\uE000\uE001\uE002\uE003z', '\uE000\uE001\uE002\uE003z')).toStrictEqual([[diff_match_patch_1.DIFF_EQUAL, '\uE000\uE001\uE002\uE003z']]);
        });
        test('equal node markers with prefix and suffix', () => {
            expect(util_1.diffText('a\uE000\uE001\uE002\uE003z', 'a\uE000\uE001\uE002\uE003z')).toStrictEqual([[diff_match_patch_1.DIFF_EQUAL, 'a\uE000\uE001\uE002\uE003z']]);
        });
        test('equal prefix only', () => {
            expect(util_1.diffText('prefix', 'prefix')).toStrictEqual([
                [diff_match_patch_1.DIFF_EQUAL, 'prefix'],
            ]);
        });
        test('changed letter within text', () => {
            expect(util_1.diffText('prefixAsuffix', 'prefixBsuffix')).toStrictEqual([
                [diff_match_patch_1.DIFF_EQUAL, 'prefix'],
                [diff_match_patch_1.DIFF_DELETE, 'A'],
                [diff_match_patch_1.DIFF_INSERT, 'B'],
                [diff_match_patch_1.DIFF_EQUAL, 'suffix'],
            ]);
        });
        test('changed node within text', () => {
            expect(util_1.diffText('prefix\uE000suffix', 'prefix\uE001suffix')).toStrictEqual([
                [diff_match_patch_1.DIFF_EQUAL, 'prefix'],
                [diff_match_patch_1.DIFF_DELETE, '\uE000'],
                [diff_match_patch_1.DIFF_INSERT, '\uE001'],
                [diff_match_patch_1.DIFF_EQUAL, 'suffix'],
            ]);
        });
        test('multiple changed letters around equal letter', () => {
            expect(util_1.diffText('abc!def', '123!456')).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, 'abc!def'],
                [diff_match_patch_1.DIFF_INSERT, '123!456'],
            ]);
        });
        test('multiple changed node markers around equal letter', () => {
            expect(util_1.diffText('\uE000\uE001\uE002!\uE003\uE004\uE005', '\uE006\uE007\uE008!\uE009\uE00A\uE00B')).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, '\uE000\uE001\uE002!\uE003\uE004\uE005'],
                [diff_match_patch_1.DIFF_INSERT, '\uE006\uE007\uE008!\uE009\uE00A\uE00B'],
            ]);
        });
        test('multiple changed letters around equal node marker', () => {
            expect(util_1.diffText('abc\uE000def', '123\uE000456')).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, 'abc'],
                [diff_match_patch_1.DIFF_INSERT, '123'],
                [diff_match_patch_1.DIFF_EQUAL, '\uE000'],
                [diff_match_patch_1.DIFF_DELETE, 'def'],
                [diff_match_patch_1.DIFF_INSERT, '456'],
            ]);
        });
        test('multiple changed node markers around equal node marker', () => {
            expect(util_1.diffText('\uE000\uE001\uE002\uF000\uE003\uE004\uE005', '\uE006\uE007\uE008\uF000\uE009\uE00A\uE00B')).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, '\uE000\uE001\uE002'],
                [diff_match_patch_1.DIFF_INSERT, '\uE006\uE007\uE008'],
                [diff_match_patch_1.DIFF_EQUAL, '\uF000'],
                [diff_match_patch_1.DIFF_DELETE, '\uE003\uE004\uE005'],
                [diff_match_patch_1.DIFF_INSERT, '\uE009\uE00A\uE00B'],
            ]);
        });
        test.each([
            '!',
            '\u0000',
            '\uDFFF',
            '\uF900',
            '\uFFFF',
            '\uDFFF\uF900',
        ])('identical text without node markers inside changed text (%#)', string => {
            expect(util_1.diffText(`abcdef${string}ghijkl`, `123456${string}7890-=`)).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, `abcdef${string}ghijkl`],
                [diff_match_patch_1.DIFF_INSERT, `123456${string}7890-=`],
            ]);
        });
        test.each([
            '\uE000',
            '\uEFEF',
            '\uF8FF',
            '\uE000\uF8FF',
            '\uE000!\uF8FF',
        ])('identical text with node markers inside changed text (%#)', string => {
            expect(util_1.diffText(`abcdef${string}ghijkl`, `123456${string}7890-=`)).toStrictEqual([
                [diff_match_patch_1.DIFF_DELETE, 'abcdef'],
                [diff_match_patch_1.DIFF_INSERT, '123456'],
                [diff_match_patch_1.DIFF_EQUAL, string],
                [diff_match_patch_1.DIFF_DELETE, 'ghijkl'],
                [diff_match_patch_1.DIFF_INSERT, '7890-='],
            ]);
        });
    });
});
describe('cleanUpNodeMarkers', () => {
    test('cleans up multiple node markers in delete', () => {
        const diff = [
            [diff_match_patch_1.DIFF_EQUAL, `abc${pChar}${ulChar}${liChar}${liChar}`],
            [diff_match_patch_1.DIFF_DELETE, `${pChar}${ulChar}${liChar}${liChar}`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}${ulChar}${liChar}${liChar}xyz`],
        ];
        util_1.cleanUpNodeMarkers(diff);
        expect(diff).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, `abc`],
            [diff_match_patch_1.DIFF_DELETE, `${pChar}${ulChar}${liChar}${liChar}`],
            [
                diff_match_patch_1.DIFF_EQUAL,
                `${pChar}${ulChar}${liChar}${liChar}${pChar}${ulChar}${liChar}${liChar}xyz`,
            ],
        ]);
    });
    test('cleans up multiple node markers in insert', () => {
        const diff = [
            [diff_match_patch_1.DIFF_EQUAL, `abc${pChar}${ulChar}${liChar}${liChar}`],
            [diff_match_patch_1.DIFF_INSERT, `${pChar}${ulChar}${liChar}${liChar}`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}${ulChar}${liChar}${liChar}xyz`],
        ];
        util_1.cleanUpNodeMarkers(diff);
        expect(diff).toStrictEqual([
            [diff_match_patch_1.DIFF_EQUAL, `abc`],
            [diff_match_patch_1.DIFF_INSERT, `${pChar}${ulChar}${liChar}${liChar}`],
            [
                diff_match_patch_1.DIFF_EQUAL,
                `${pChar}${ulChar}${liChar}${liChar}${pChar}${ulChar}${liChar}${liChar}xyz`,
            ],
        ]);
    });
    test('cleans up a node marker in delete and removes a redundant diff item', () => {
        const diff = [
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}`],
            [diff_match_patch_1.DIFF_DELETE, `abc${pChar}`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}xyz`],
        ];
        util_1.cleanUpNodeMarkers(diff);
        expect(diff).toStrictEqual([
            [diff_match_patch_1.DIFF_DELETE, `${pChar}abc`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}${pChar}xyz`],
        ]);
    });
    test('cleans up a node marker in insert and removes a redundant diff item', () => {
        const diff = [
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}`],
            [diff_match_patch_1.DIFF_INSERT, `abc${pChar}`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}xyz`],
        ];
        util_1.cleanUpNodeMarkers(diff);
        expect(diff).toStrictEqual([
            [diff_match_patch_1.DIFF_INSERT, `${pChar}abc`],
            [diff_match_patch_1.DIFF_EQUAL, `${pChar}${pChar}xyz`],
        ]);
    });
});
