'use strict';

// Matches newline characters
const REG_NEWLINES = /\r?\n/g;

// Removes starting asterisk if any
const REG_REMOVE_STARTING_ASTERISK = /^[\s]{0,}[*]{1}[\s]{0,}/mis;

// Split on any space
const REG_SPLIT_ON_SPACE = /\s/ims;

/**
 * Fixes the comments and strips asterisks and combines multi line comments.
 * @param {string} jsComment - The js comment to fix.
 * @param {number} commentLineNumber - The current comment line number.
 * @returns {object} - The parsed lined object.
 */
export function fixComments(jsComment, commentLineNumber) {

    // Variables
    const obj = { lines: [], desc: '', lineNumber: commentLineNumber };

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
        srcObj.tag = srcObj.line.split(REG_SPLIT_ON_SPACE, 2)[0].toLowerCase();

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
            line: '',
            lineNumber: commentLineNumber + i
        };

        // Get the raw line
        src.raw = lines[i];

        // Pre Process
        const pre = prep(src.raw);
        src.line = pre.line;
        src.tag = pre.tag;

        // Check for multi lines
        if (src.tag[0] === '@') {

            if (multiComments.includes(src.tag)) {
                for (let ii = (i + 1); ii < lines.length; ii++) {

                    const pre2 = prep(lines[ii]);
                    if (pre2.tag[0] !== '@') {

                        // Add to 
                        src.line += `\n${pre2.line}`;

                    } else {

                        // Set new position
                        i = ii-1;
                        break;
                    }
                }
            }

            // Add the tag name
            obj.lines.push(src);

        } else {

            // Description tag
            obj.desc += (obj.desc === '') ? src.line : `\n${src.line}`;

        }

    }

    // Return the processed lines
    return obj;

}