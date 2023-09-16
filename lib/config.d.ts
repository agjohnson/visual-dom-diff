import { DomIteratorOptions } from './domIterator';
import { DiffTextType, IndefiniteNodePredicate, NodePredicate } from './util';
/**
 * The options for `visualDomDiff`.
 */
export interface Options {
    /**
     * The class name to use to mark up inserted content.
     * Default is `'vdd-added'`.
     */
    addedClass?: string;
    /**
     * The class name to use to mark up modified content.
     * Default is `'vdd-modified'`.
     */
    modifiedClass?: string;
    /**
     * The class name to use to mark up removed content.
     * Default is `'vdd-removed'`.
     */
    removedClass?: string;
    /**
     * If `true`, the modified content (text formatting changes) will not be marked.
     * Default is `false`.
     */
    skipModified?: boolean;
    /**
     * Indicates if the child nodes of the specified `node` should be ignored.
     * It is useful for ignoring child nodes of an element representing some embedded content,
     * which should not be compared. Return `undefined` for the default behaviour.
     */
    skipChildren?: IndefiniteNodePredicate;
    /**
     * Indicates if the specified `node` should be ignored.
     * Even if the `node` is ignored, its child nodes will still be processed,
     * unless `skipChildNodes` says they should also be ignored.
     * Ignored elements whose child nodes are processed are treated as formatting elements.
     * Return `undefined` for the default behaviour.
     */
    skipSelf?: IndefiniteNodePredicate;
    /**
     * A plain-text diff function, which is used internally to compare serialized
     * representations of DOM nodes, where each DOM element is represented by a single
     * character from the Private Use Area of the Basic Multilingual Unicode Plane. It defaults
     * to [diff_main](https://github.com/google/diff-match-patch/wiki/API#diff_maintext1-text2--diffs).
     */
    diffText?: DiffTextType;
}
export interface Config extends Options, DomIteratorOptions {
    readonly addedClass: string;
    readonly modifiedClass: string;
    readonly removedClass: string;
    readonly skipModified: boolean;
    readonly skipChildren: NodePredicate;
    readonly skipSelf: NodePredicate;
    readonly diffText: DiffTextType;
}
export declare function optionsToConfig({ addedClass, modifiedClass, removedClass, skipModified, skipChildren, skipSelf, diffText, }?: Options): Config;
