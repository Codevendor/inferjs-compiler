'use strict';

import { readFile } from "./read-file.mjs";

/**
 * Gets a json file safely, not supported in es6 import.
 * @param {string} filePath The file path to the json string.
 * @param {string} globalName If assign a name then global is set.
 * @returns {object} Returns a json object of file.
 */
export async function jsonLoader(file, globalName = '') {

    const results = await readFile(file, 'utf8');
    
    // Return empty object
    if(results.err) throw results.err;

    let jsonObject = '';

    // Try to parse 
    try{
        jsonObject = JSON.parse(results.data);
    } catch(err) {
        throw err;
    }

    if(globalName!=='') {
        global[globalName] = jsonObject;
    } else {
        return jsonObject;
    }

}