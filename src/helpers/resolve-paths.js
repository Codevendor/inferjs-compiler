'use strict';

import path from "node:path";
import { type_of, lstat } from "./helpers.js";

/**
 * Resolves and normalizing all paths in an array.
 * @param {array} pathList The path list to normalize and resolve.
 * @returns {array} An array of objects containing the paths normalized and resolved and whether isDirectory.
 */
export async function resolvePaths(pathList) {

    switch (type_of(pathList, true)) {

        case 'undefined': return [];
        case 'string':
            pathList = [pathList];
            break;

        case 'array': break;
        default: return [];
    }

    for (let i = 0; i < pathList.length; i++) {

        // Get path
        const pathOf = pathList[i];

        // Get path stats
        const pathStats = await lstat(pathOf);

        if (pathStats.err) throw pathStats.err;

        pathList[i] = {
            path: (!path.isAbsolute(pathOf)) ? path.normalize(path.resolve(pathOf)) : pathOf,
            isDirectory: pathStats.stats.isDirectory()
        };

    }

    return pathList;

}