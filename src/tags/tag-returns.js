'use strict';

// Imports
import {
    ripTypes,
    type_of,
    REG_INFER_FIX_COMMENTS
} from "../helpers/helpers.js";

// Parse returns
const REG_TAG_RETURNS = /@returns{0,1}\s{1,}\{{0,1}([^}{]+)\}{0,1}\s{0,}-{0,1}\s{0,}(.*)?/ims;

/**
 * Parses the tag @returns.
 * @param {object} parser - The parser class.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid = The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 */
export function tagReturns(parser, filePath, inferid, lineObject) {

    /*
    let match = line.match(REG_TAG_RETURNS);
    if (!match || match.length !== 3) return;

    // Rip the types
    let types = ripTypes(match[1]);

    // Get the description
    let pdesc = (type_of(match[2]) === 'undefined') ? '' : match[2];

    parser.source.infers[inferid][tag] = {
        types: {}, "description": pdesc.replace(REG_INFER_FIX_COMMENTS, "\n")
    };

    types.map(type => {
        parser.source.infers[inferid][tag]['types'][type] = {};
    });
*/
}