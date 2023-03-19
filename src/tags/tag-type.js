'use strict';

// Imports
import { setValue } from "../helpers/set-value.js";

const REG_TAG_TYPE = /@type\s{0,}{([^}]+)}\s{0,}-{0,}\s{0,}(.*)/mis;

/**
 * Parses the tag @type.
 * @param {object} parser - The parser class.
 * @param {string} commentType - The comment type.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid - The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 * @param {string} name - The name of the variable or function.
 */
export function tagType(parser, commentType, filePath, inferid, lineObject, name) {

    // Parse Match
    let match = lineObject.line.match(REG_TAG_TYPE);

    // Must have 3 params
    if (!match || match.length !== 3) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);
        return;
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
    setValue(parser.source, [commentType, 'infers', inferid, 'types'], {});

    // Add Types
    types.forEach(tname => {
        setValue(parser.source, [commentType, 'infers', inferid, 'types', tname], {});
        setValue(parser.source, [commentType, 'infers', inferid, 'types', tname, 'name'], name);
        setValue(parser.source, [commentType, 'infers', inferid, 'types', tname, 'description'], description);
    });



}