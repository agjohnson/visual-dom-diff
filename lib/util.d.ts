import { Diff } from 'diff-match-patch';
export declare type NodePredicate = (node: Node) => boolean;
export declare type IndefiniteNodePredicate = (node: Node) => boolean | undefined;
export declare type DiffTextType = (oldText: string, newText: string) => Diff[];
export declare function isElement(node: Node): node is HTMLElement;
export declare function isText(node: Node): node is Text;
export declare function isDocument(node: Node): node is Document;
export declare function isDocumentFragment(node: Node): node is DocumentFragment;
export declare function isComment(node: Node): node is Comment;
export declare type Comparator<T> = (item1: T, item2: T) => boolean;
export declare function strictEqual<T>(item1: T, item2: T): boolean;
export declare function areArraysEqual<T>(array1: T[], array2: T[], comparator?: Comparator<T>): boolean;
/**
 * Compares DOM nodes for equality.
 * @param node1 The first node to compare.
 * @param node2 The second node to compare.
 * @param deep If true, the child nodes are compared recursively too.
 * @returns `true`, if the 2 nodes are equal, otherwise `false`.
 */
export declare function areNodesEqual(node1: Node, node2: Node, deep?: boolean): boolean;
/**
 * Gets a list of `node`'s ancestor nodes up until and including `rootNode`.
 * @param node Node whose ancestors to get.
 * @param rootNode The root node.
 */
export declare function getAncestors(node: Node, rootNode?: Node | null): Node[];
export declare function never(message?: string): never;
export declare function hashCode(str: string): number;
/**
 * Returns a single character which should replace the given node name
 * when serializing a non-text node.
 */
export declare function charForNodeName(nodeName: string): string;
/**
 * Moves trailing HTML tag markers in the DIFF_INSERT and DIFF_DELETE diff items to the front,
 * if possible, in order to improve quality of the DOM diff.
 */
export declare function cleanUpNodeMarkers(diff: Diff[]): void;
/**
 * Diffs the 2 strings and cleans up the result before returning it.
 */
export declare function diffText(oldText: string, newText: string): Diff[];
export declare function markUpNode(node: Node, elementName: string, className: string): void;
export declare function isTableValid(table: Node, verifyColumns: boolean): boolean;
