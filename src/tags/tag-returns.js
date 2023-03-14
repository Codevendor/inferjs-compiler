'use strict';

// Imports
import { setValue } from "../helpers/set-value.js";

const REG_TAG_RETURNS = /@returns{0,}\s{0,}{([^}]+)}\s{0,}-{0,}\s{0,}(.*)/mis;

/**
 * Parses the tag @returns.
 * @param {object} parser - The parser class.
 * @param {string} commentType - The comment type.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid = The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 */
export function tagReturns(parser, commentType, filePath, inferid, lineObject) {

    // Parse Match
    let match = lineObject.line.match(REG_TAG_RETURNS);

    // Must have 3 params
    if (!match || match.length !== 3) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);

    }

    // Get types
    let types = match[1].trim();
    if (types.startsWith('(') && types.endsWith(')')) {
        types = types.slice(1, -1).trim();
    }
    types = types.split('|').map(item => item.trim());

    // Get description
    const description = match[2].trim();

    // Set returns object
    setValue(parser.source, ['methods', 'infers', inferid, '@returns'], {});
    setValue(parser.source, ['methods', 'infers', inferid, '@returns', 'types'], {});

    // Add Types
    types.forEach(tname => {
        setValue(parser.source, ['methods', 'infers', inferid, '@returns', 'types', tname], {});
        setValue(parser.source, ['methods', 'infers', inferid, '@returns', 'types', tname, 'description'], description);
    });

}