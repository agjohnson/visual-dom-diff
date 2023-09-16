import { DIFF_DELETE, DIFF_INSERT } from 'diff-match-patch';
import { optionsToConfig } from './config';
import { DomIterator } from './domIterator';
import { areNodesEqual, charForNodeName, getAncestors, isElement, isTableValid, isText, markUpNode, never, } from './util';
/**
 * A simple helper which allows us to treat TH as TD in certain situations.
 */
const nodeNameOverride = (nodeName) => {
    return nodeName === 'TH' ? 'TD' : nodeName;
};
/**
 * Stringifies a DOM node recursively. Text nodes are represented by their `data`,
 * while all other nodes are represented by a single Unicode code point
 * from the Private Use Area of the Basic Multilingual Plane.
 */
const serialize = (root, config) => new DomIterator(root, config).reduce((text, node) => text +
    (isText(node)
        ? node.data
        : charForNodeName(nodeNameOverride(node.nodeName))), '');
const getLength = (node) => (isText(node) ? node.length : 1);
const isTr = (node) => node.nodeName === 'TR';
const isNotTr = (node) => !isTr(node);
const trIteratorOptions = {
    skipChildren: isTr,
    skipSelf: isNotTr,
};
export function visualDomDiff(oldRootNode, newRootNode, options = {}) {
    // Define config and simple helpers.
    const document = newRootNode.ownerDocument || newRootNode;
    const config = optionsToConfig(options);
    const { addedClass, diffText, modifiedClass, removedClass, skipSelf, skipChildren, } = config;
    const notSkipSelf = (node) => !skipSelf(node);
    const getDepth = (node, rootNode) => getAncestors(node, rootNode).filter(notSkipSelf).length;
    const isFormattingNode = (node) => isElement(node) && skipSelf(node);
    const getFormattingAncestors = (node, rootNode) => getAncestors(node, rootNode)
        .filter(isFormattingNode)
        .reverse();
    const getColumnValue = (node) => addedNodes.has(node) ? 1 : removedNodes.has(node) ? -1 : 0;
    // Input iterators.
    const diffArray = diffText(serialize(oldRootNode, config), serialize(newRootNode, config));
    let diffIndex = 0;
    const oldIterator = new DomIterator(oldRootNode, config);
    const newIterator = new DomIterator(newRootNode, config);
    // Input variables produced by the input iterators.
    let oldDone;
    let newDone;
    let diffItem;
    let oldNode;
    let newNode;
    let diffOffset = 0;
    let oldOffset = 0;
    let newOffset = 0;
    diffItem = diffArray[diffIndex++];
    ({ done: oldDone, value: oldNode } = oldIterator.next());
    ({ done: newDone, value: newNode } = newIterator.next());
    // Output variables.
    const rootOutputNode = document.createDocumentFragment();
    let oldOutputNode = rootOutputNode;
    let oldOutputDepth = 0;
    let newOutputNode = rootOutputNode;
    let newOutputDepth = 0;
    let removedNode = null;
    let addedNode = null;
    const removedNodes = new Set();
    const addedNodes = new Set();
    const modifiedNodes = new Set();
    const formattingMap = new Map();
    const equalTables = new Array();
    const equalRows = new Map();
    function prepareOldOutput() {
        const depth = getDepth(oldNode, oldRootNode);
        while (oldOutputDepth > depth) {
            /* istanbul ignore if */
            if (!oldOutputNode.parentNode) {
                return never();
            }
            if (oldOutputNode === removedNode) {
                removedNode = null;
            }
            oldOutputNode = oldOutputNode.parentNode;
            oldOutputDepth--;
        }
        /* istanbul ignore if */
        if (oldOutputDepth !== depth) {
            return never();
        }
    }
    function prepareNewOutput() {
        const depth = getDepth(newNode, newRootNode);
        while (newOutputDepth > depth) {
            /* istanbul ignore if */
            if (!newOutputNode.parentNode) {
                return never();
            }
            if (newOutputNode === addedNode) {
                addedNode = null;
            }
            newOutputNode = newOutputNode.parentNode;
            newOutputDepth--;
        }
        /* istanbul ignore if */
        if (newOutputDepth !== depth) {
            return never();
        }
    }
    function appendCommonChild(node) {
        /* istanbul ignore if */
        if (oldOutputNode !== newOutputNode || addedNode || removedNode) {
            return never();
        }
        if (isText(node)) {
            const oldFormatting = getFormattingAncestors(oldNode, oldRootNode);
            const newFormatting = getFormattingAncestors(newNode, newRootNode);
            formattingMap.set(node, newFormatting);
            const length = oldFormatting.length;
            if (length !== newFormatting.length) {
                modifiedNodes.add(node);
            }
            else {
                for (let i = 0; i < length; ++i) {
                    if (!areNodesEqual(oldFormatting[i], newFormatting[i])) {
                        modifiedNodes.add(node);
                        break;
                    }
                }
            }
        }
        else {
            if (!areNodesEqual(oldNode, newNode)) {
                modifiedNodes.add(node);
            }
            const nodeName = oldNode.nodeName;
            if (nodeName === 'TABLE') {
                equalTables.push({
                    newTable: newNode,
                    oldTable: oldNode,
                    outputTable: node,
                });
            }
            else if (nodeName === 'TR') {
                equalRows.set(node, {
                    newRow: newNode,
                    oldRow: oldNode,
                });
            }
        }
        newOutputNode.appendChild(node);
        oldOutputNode = node;
        newOutputNode = node;
        oldOutputDepth++;
        newOutputDepth++;
    }
    function appendOldChild(node) {
        if (!removedNode) {
            removedNode = node;
            removedNodes.add(node);
        }
        if (isText(node)) {
            const oldFormatting = getFormattingAncestors(oldNode, oldRootNode);
            formattingMap.set(node, oldFormatting);
        }
        oldOutputNode.appendChild(node);
        oldOutputNode = node;
        oldOutputDepth++;
    }
    function appendNewChild(node) {
        if (!addedNode) {
            addedNode = node;
            addedNodes.add(node);
        }
        if (isText(node)) {
            const newFormatting = getFormattingAncestors(newNode, newRootNode);
            formattingMap.set(node, newFormatting);
        }
        newOutputNode.appendChild(node);
        newOutputNode = node;
        newOutputDepth++;
    }
    function nextDiff(step) {
        const length = diffItem[1].length;
        diffOffset += step;
        if (diffOffset === length) {
            diffItem = diffArray[diffIndex++];
            diffOffset = 0;
        }
        else {
            /* istanbul ignore if */
            if (diffOffset > length) {
                return never();
            }
        }
    }
    function nextOld(step) {
        const length = getLength(oldNode);
        oldOffset += step;
        if (oldOffset === length) {
            ;
            ({ done: oldDone, value: oldNode } = oldIterator.next());
            oldOffset = 0;
        }
        else {
            /* istanbul ignore if */
            if (oldOffset > length) {
                return never();
            }
        }
    }
    function nextNew(step) {
        const length = getLength(newNode);
        newOffset += step;
        if (newOffset === length) {
            ;
            ({ done: newDone, value: newNode } = newIterator.next());
            newOffset = 0;
        }
        else {
            /* istanbul ignore if */
            if (newOffset > length) {
                return never();
            }
        }
    }
    // Copy all content from oldRootNode and newRootNode to rootOutputNode,
    // while deduplicating identical content.
    // Difference markers and formatting are excluded at this stage.
    while (diffItem) {
        if (diffItem[0] === DIFF_DELETE) {
            /* istanbul ignore if */
            if (oldDone) {
                return never();
            }
            prepareOldOutput();
            const length = Math.min(diffItem[1].length - diffOffset, getLength(oldNode) - oldOffset);
            const text = diffItem[1].substring(diffOffset, diffOffset + length);
            appendOldChild(isText(oldNode)
                ? document.createTextNode(text)
                : oldNode.cloneNode(false));
            nextDiff(length);
            nextOld(length);
        }
        else if (diffItem[0] === DIFF_INSERT) {
            /* istanbul ignore if */
            if (newDone) {
                return never();
            }
            prepareNewOutput();
            const length = Math.min(diffItem[1].length - diffOffset, getLength(newNode) - newOffset);
            const text = diffItem[1].substring(diffOffset, diffOffset + length);
            appendNewChild(isText(newNode)
                ? document.createTextNode(text)
                : newNode.cloneNode(false));
            nextDiff(length);
            nextNew(length);
        }
        else {
            /* istanbul ignore if */
            if (oldDone || newDone) {
                return never();
            }
            prepareOldOutput();
            prepareNewOutput();
            const length = Math.min(diffItem[1].length - diffOffset, getLength(oldNode) - oldOffset, getLength(newNode) - newOffset);
            const text = diffItem[1].substring(diffOffset, diffOffset + length);
            if (oldOutputNode === newOutputNode &&
                ((isText(oldNode) && isText(newNode)) ||
                    (nodeNameOverride(oldNode.nodeName) ===
                        nodeNameOverride(newNode.nodeName) &&
                        !skipChildren(oldNode) &&
                        !skipChildren(newNode)) ||
                    areNodesEqual(oldNode, newNode))) {
                appendCommonChild(isText(newNode)
                    ? document.createTextNode(text)
                    : newNode.cloneNode(false));
            }
            else {
                appendOldChild(isText(oldNode)
                    ? document.createTextNode(text)
                    : oldNode.cloneNode(false));
                appendNewChild(isText(newNode)
                    ? document.createTextNode(text)
                    : newNode.cloneNode(false));
            }
            nextDiff(length);
            nextOld(length);
            nextNew(length);
        }
    }
    // Move deletes before inserts.
    removedNodes.forEach(node => {
        const parentNode = node.parentNode;
        let previousSibling = node.previousSibling;
        while (previousSibling && addedNodes.has(previousSibling)) {
            parentNode.insertBefore(node, previousSibling);
            previousSibling = node.previousSibling;
        }
    });
    // Ensure a user friendly result for tables.
    equalTables.forEach(equalTable => {
        const { newTable, oldTable, outputTable } = equalTable;
        // Handle tables which can't be diffed nicely.
        if (!isTableValid(oldTable, true) ||
            !isTableValid(newTable, true) ||
            !isTableValid(outputTable, false)) {
            // Remove all values which were previously recorded for outputTable.
            new DomIterator(outputTable).forEach(node => {
                addedNodes.delete(node);
                removedNodes.delete(node);
                modifiedNodes.delete(node);
                formattingMap.delete(node);
            });
            // Display both the old and new table.
            const parentNode = outputTable.parentNode;
            const oldTableClone = oldTable.cloneNode(true);
            const newTableClone = newTable.cloneNode(true);
            parentNode.insertBefore(oldTableClone, outputTable);
            parentNode.insertBefore(newTableClone, outputTable);
            parentNode.removeChild(outputTable);
            removedNodes.add(oldTableClone);
            addedNodes.add(newTableClone);
            return;
        }
        // Figure out which columns have been added or removed
        // based on the first row appearing in both tables.
        //
        // -  1: column added
        // -  0: column equal
        // - -1: column removed
        const columns = [];
        new DomIterator(outputTable, trIteratorOptions).some(row => {
            const diffedRows = equalRows.get(row);
            if (!diffedRows) {
                return false;
            }
            const { oldRow, newRow } = diffedRows;
            const oldColumnCount = oldRow.childNodes.length;
            const newColumnCount = newRow.childNodes.length;
            const maxColumnCount = Math.max(oldColumnCount, newColumnCount);
            const minColumnCount = Math.min(oldColumnCount, newColumnCount);
            if (row.childNodes.length === maxColumnCount) {
                // The generic diff algorithm worked properly in this case,
                // so we can rely on its results.
                const cells = row.childNodes;
                for (let i = 0, l = cells.length; i < l; ++i) {
                    columns.push(getColumnValue(cells[i]));
                }
            }
            else {
                // Fallback to a simple but correct algorithm.
                let i = 0;
                let columnValue = 0;
                while (i < minColumnCount) {
                    columns[i++] = columnValue;
                }
                columnValue = oldColumnCount < newColumnCount ? 1 : -1;
                while (i < maxColumnCount) {
                    columns[i++] = columnValue;
                }
            }
            return true;
        });
        const columnCount = columns.length;
        /* istanbul ignore if */
        if (columnCount === 0) {
            return never();
        }
        // Fix up the rows which do not align with `columns`.
        new DomIterator(outputTable, trIteratorOptions).forEach(row => {
            const cells = row.childNodes;
            if (addedNodes.has(row) || addedNodes.has(row.parentNode)) {
                if (cells.length < columnCount) {
                    for (let i = 0; i < columnCount; ++i) {
                        if (columns[i] === -1) {
                            const td = document.createElement('TD');
                            row.insertBefore(td, cells[i]);
                            removedNodes.add(td);
                        }
                    }
                }
            }
            else if (removedNodes.has(row) ||
                removedNodes.has(row.parentNode)) {
                if (cells.length < columnCount) {
                    for (let i = 0; i < columnCount; ++i) {
                        if (columns[i] === 1) {
                            const td = document.createElement('TD');
                            row.insertBefore(td, cells[i]);
                        }
                    }
                }
            }
            else {
                // Check, if the columns in this row are aligned with those in the reference row.
                let isAligned = true;
                for (let i = 0, l = cells.length; i < l; ++i) {
                    if (getColumnValue(cells[i]) !== columns[i]) {
                        isAligned = false;
                        break;
                    }
                }
                if (!isAligned) {
                    // Remove all values which were previously recorded for row's content.
                    const iterator = new DomIterator(row);
                    iterator.next(); // Skip the row itself.
                    iterator.forEach(node => {
                        addedNodes.delete(node);
                        removedNodes.delete(node);
                        modifiedNodes.delete(node);
                        formattingMap.delete(node);
                    });
                    // Remove the row's content.
                    while (row.firstChild) {
                        row.removeChild(row.firstChild);
                    }
                    // Diff the individual cells.
                    const { newRow, oldRow } = equalRows.get(row);
                    const newCells = newRow.childNodes;
                    const oldCells = oldRow.childNodes;
                    let oldIndex = 0;
                    let newIndex = 0;
                    for (let i = 0; i < columnCount; ++i) {
                        if (columns[i] === 1) {
                            const newCellClone = newCells[newIndex++].cloneNode(true);
                            row.appendChild(newCellClone);
                            addedNodes.add(newCellClone);
                        }
                        else if (columns[i] === -1) {
                            const oldCellClone = oldCells[oldIndex++].cloneNode(true);
                            row.appendChild(oldCellClone);
                            removedNodes.add(oldCellClone);
                        }
                        else {
                            row.appendChild(visualDomDiff(oldCells[oldIndex++], newCells[newIndex++], options));
                        }
                    }
                }
            }
        });
        return;
    });
    // Mark up the content which has been removed.
    removedNodes.forEach(node => {
        markUpNode(node, 'DEL', removedClass);
    });
    // Mark up the content which has been added.
    addedNodes.forEach(node => {
        markUpNode(node, 'INS', addedClass);
    });
    // Mark up the content which has been modified.
    if (!config.skipModified) {
        modifiedNodes.forEach(modifiedNode => {
            markUpNode(modifiedNode, 'INS', modifiedClass);
        });
    }
    // Add formatting.
    formattingMap.forEach((formattingNodes, textNode) => {
        formattingNodes.forEach(formattingNode => {
            const parentNode = textNode.parentNode;
            const previousSibling = textNode.previousSibling;
            if (previousSibling &&
                areNodesEqual(previousSibling, formattingNode)) {
                previousSibling.appendChild(textNode);
            }
            else {
                const clonedFormattingNode = formattingNode.cloneNode(false);
                parentNode.insertBefore(clonedFormattingNode, textNode);
                clonedFormattingNode.appendChild(textNode);
            }
        });
    });
    return rootOutputNode;
}
