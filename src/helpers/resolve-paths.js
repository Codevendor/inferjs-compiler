'use strict';

import path from "node:path";
import { type_of } from "./type-of.js";

/**
 * Resolves and normalizing all paths in an array.
 * @param {array} pathList The path list to normalize and resolve.
 * @returns {array} An array containing the paths normalized and resolved.
 */
export function resolvePaths(pathList) {

    switch (type_of(pathList, true)) {
        
        case 'undefined': return [];
        case 'string':
            pathList = [pathList];
            break;

        case 'array': break;
        default: return [];
    }

    return pathList.map(item => {
        if (!path.isAbsolute(item)) {
            return path.normalize(path.resolve(item));
        } else {
            return item;
        }
    });

}