(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "jsdom", "./config", "./util"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const jsdom_1 = require("jsdom");
    const config_1 = require("./config");
    const util_1 = require("./util");
    const document = new jsdom_1.JSDOM('').window.document;
    const text = document.createTextNode('text');
    const span = document.createElement('SPAN');
    const div = document.createElement('DIV');
    const video = document.createElement('VIDEO');
    const comment = document.createComment('comment');
    const fragment = document.createDocumentFragment();
    describe('skipChildren', () => {
        describe('without options', () => {
            const config = config_1.optionsToConfig();
            test('return true given a text node', () => {
                expect(config.skipChildren(text)).toBe(true);
            });
            test('return true given a comment node', () => {
                expect(config.skipChildren(comment)).toBe(true);
            });
            test('return false given a SPAN', () => {
                expect(config.skipChildren(span)).toBe(false);
            });
            test('return true given a VIDEO', () => {
                expect(config.skipChildren(video)).toBe(true);
            });
            test('return false given a DIV', () => {
                expect(config.skipChildren(div)).toBe(false);
            });
            test('return false given a document fragment', () => {
                expect(config.skipChildren(fragment)).toBe(false);
            });
            test('return false given a document', () => {
                expect(config.skipChildren(document)).toBe(false);
            });
        });
        describe('with options', () => {
            const config = config_1.optionsToConfig({
                skipChildren(node) {
                    return node.nodeName === 'SPAN'
                        ? true
                        : node.nodeName === 'VIDEO'
                            ? false
                            : util_1.isText(node) || util_1.isComment(node)
                                ? false
                                : util_1.isDocumentFragment(node)
                                    ? true
                                    : undefined;
                },
            });
            test('return true given a text node', () => {
                expect(config.skipChildren(text)).toBe(true);
            });
            test('return true given a comment node', () => {
                expect(config.skipChildren(comment)).toBe(true);
            });
            test('return true given a SPAN', () => {
                expect(config.skipChildren(span)).toBe(true);
            });
            test('return false given a VIDEO', () => {
                expect(config.skipChildren(video)).toBe(false);
            });
            test('return false given a DIV', () => {
                expect(config.skipChildren(div)).toBe(false);
            });
            test('return true given a document fragment', () => {
                expect(config.skipChildren(fragment)).toBe(true);
            });
            test('return false given a document', () => {
                expect(config.skipChildren(document)).toBe(false);
            });
        });
    });
    describe('skipSelf', () => {
        describe('without options', () => {
            const config = config_1.optionsToConfig();
            test('return false given a text node', () => {
                expect(config.skipSelf(text)).toBe(false);
            });
            test('return true given a comment node', () => {
                expect(config.skipSelf(comment)).toBe(true);
            });
            test('return true given a SPAN', () => {
                expect(config.skipSelf(span)).toBe(true);
            });
            test('return false given a VIDEO', () => {
                expect(config.skipSelf(video)).toBe(false);
            });
            test('return false given a DIV', () => {
                expect(config.skipSelf(div)).toBe(false);
            });
            test('return true given a document fragment', () => {
                expect(config.skipSelf(fragment)).toBe(true);
            });
        });
        describe('with options', () => {
            const config = config_1.optionsToConfig({
                skipSelf(node) {
                    return util_1.isText(node)
                        ? true
                        : util_1.isComment(node)
                            ? false
                            : util_1.isDocumentFragment(node)
                                ? false
                                : node.nodeName === 'SPAN'
                                    ? false
                                    : node.nodeName === 'VIDEO'
                                        ? true
                                        : undefined;
                },
            });
            test('return true given a text node', () => {
                expect(config.skipSelf(text)).toBe(true);
            });
            test('return true given a comment node', () => {
                expect(config.skipSelf(comment)).toBe(true);
            });
            test('return false given a SPAN', () => {
                expect(config.skipSelf(span)).toBe(false);
            });
            test('return true given a VIDEO', () => {
                expect(config.skipSelf(video)).toBe(true);
            });
            test('return false given a DIV', () => {
                expect(config.skipSelf(div)).toBe(false);
            });
            test('return true given a document fragment', () => {
                expect(config.skipSelf(fragment)).toBe(true);
            });
        });
    });
    describe('simple options', () => {
        test('default', () => {
            const config = config_1.optionsToConfig();
            expect(config.addedClass).toBe('vdd-added');
            expect(config.diffText).toBe(util_1.diffText);
            expect(config.modifiedClass).toBe('vdd-modified');
            expect(config.removedClass).toBe('vdd-removed');
            expect(config.skipModified).toBe(false);
        });
        test('override', () => {
            const customDiffText = (_oldText, _newText) => [];
            const config = config_1.optionsToConfig({
                addedClass: 'ADDED',
                diffText: customDiffText,
                modifiedClass: 'MODIFIED',
                removedClass: 'REMOVED',
                skipModified: true,
            });
            expect(config.addedClass).toBe('ADDED');
            expect(config.diffText).toBe(customDiffText);
            expect(config.modifiedClass).toBe('MODIFIED');
            expect(config.removedClass).toBe('REMOVED');
            expect(config.skipModified).toBe(true);
        });
    });
});
