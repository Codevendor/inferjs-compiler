'use strict';

import path from "node:path";
import { fileURLToPath } from 'node:url';

/**
 * Loads the app info filename and dirname.
 * @param {object} meta - The meta to use.
 * @returns {object} Returns a json object of file.
 */
export function loadMeta(meta) {

    const obj = {
        "__filename": '',
        "__dirname": ''
    };

    if (typeof meta === 'object' && meta.url) {

        obj['__filename'] = fileURLToPath(meta.url);
        obj['__dirname'] = path.dirname(obj['__filename']);

    }

    return obj;

}