'use strict';

// Get helper methods
import {
    REG_NEWLINES,
    REG_REMOVE_STARTING_ASTERISK,
    REG_SPLIT_ON_SPACE
} from "../helpers/helpers.js";

/**
 * Fixes the comments and strips asterisks and combines multi line comments.
 * @param {string} jsComment - The js comment to fix.
 * @returns {object} - The parsed lined object.
 */
export function fixComments(jsComment) {

    // Variables
    const obj = { lines: [], desc: '' };

    // List of tag types that can have multi line comments.
    const multiComments = [
        '@param',
        '@infer',
        '@type',
        '@return',
        '@returns'
    ];

    // Pre Process
    const prep = (src) => {

        let srcObj = { line: '', tag: '' };

        // Remove asterisk from front then trim start
        srcObj.line = src.replace(REG_REMOVE_STARTING_ASTERISK, '').trimStart();

        // Get tag
        srcObj.tag = srcObj.line.split(REG_SPLIT_ON_SPACE, 2)[0];

        return srcObj;
    }

    // Get the lines
    const lines = jsComment.split(REG_NEWLINES);

    // Split into lines for parsing and remove starting * if one.
    for (let i = 0; i < lines.length; i++) {

        // The object of the line parse
        const src = {
            raw: '',
            tag: '',
            line: ''
        };

        // Get the raw line
        src.raw = lines[i];

        // Pre Process
        const pre = prep(src.raw);

        // Check for multi lines
        if (pre.tag[0] === '@') {

            if (multiComments.includes(pre.tag)) {
                for (let ii = (i + 1); ii < lines.length; ii++) {

                    const pre2 = prep(lines[ii]);
                    if (pre2.tag[0] !== '@') {

                        // Add to 
                        pre.line += `\n${pre2.line}`;

                    } else {

                        // Set new position
                        i = ii-1;
                        break;
                    }
                }
            }

            // Add the tag name
            obj.lines.push(pre);

        } else {

            // Description tag
            obj.desc += (obj.desc === '') ? pre.line : `\n${pre.line}`;

        }

    }

    // Return the processed lines
    return obj;

}