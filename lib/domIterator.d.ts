import { NodePredicate } from './util';
export interface DomIteratorOptions {
    skipSelf?: NodePredicate;
    skipChildren?: NodePredicate;
}
export declare class DomIterator implements Iterator<Node> {
    private rootNode;
    private config?;
    private nextNode;
    private descend;
    constructor(rootNode: Node, config?: DomIteratorOptions | undefined);
    toArray(): Node[];
    forEach(fn: (node: Node) => void): void;
    reduce<T>(fn: (result: T, current: Node) => T, initial: T): T;
    some(fn: (node: Node) => boolean): boolean;
    next(): IteratorResult<Node>;
    private skipSelf;
    private skipChildren;
}
