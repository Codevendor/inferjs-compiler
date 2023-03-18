'use strict';

// Imports
import { setValue } from "../helpers/set-value.js";

// Breaks apart the param line 
const REG_TAG_PARAM = /@param\s{0,}{([^}]+)}\s{0,}(\[{1}.*\]{1})\s{0,}-{0,1}\s{0,}(.*)|@param\s{0,}{([^}]+)}\s{0,}([^\[\]\s]+)\s{0,}-{0,}\s{0,}(.*)/mis;

/**
 * Parses the tag @param.
 * @param {object} parser - The parser class.
 * @param {string} commentType - The comment type.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid - The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 * @param {string} name - The name of the variable or function.
 */
export function tagParam(parser, commentType, filePath, inferid, lineObject, name) {

    // Must be 'methods' 
    if(commentType==='variables') return;

    // Parse Match
    let match = lineObject.line.match(REG_TAG_PARAM);

    // Must have 7 params
    if (!match || match.length !== 7) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);
        return;
    }

    // Move match from or condition
    if(typeof match[1]==='undefined') {
        match[1] = match[4];
        match[2] = match[5];
        match[3] = match[6];
    }

    // Get types
    let types = match[1].trim();
    if (types.startsWith('(') && types.endsWith(')')) {
        types = types.slice(1, -1).trim();
    }
    types = types.split('|').map(item => item.trim());

    // Get name2, optional, defaultValue
    let name2 = match[2].trim();
    let optional = false;
    if(name2.startsWith('[') && name2.endsWith(']')) {
        optional = true;
        name2 = name2.slice(1, -1).trim();
    }
    const nameParts = name2.split('=').map(item => item.trim());
    name2 = nameParts[0];
    let defaultValue = undefined;
    let hasDefault = false;
    if(nameParts.length==2) {
        hasDefault = true;
        defaultValue = nameParts[1];
    }

    // Get description
    const description = match[3].trim();

    // Set Param Name
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name2], {});

    // Set Param Description
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'description'], description);

    // Set Optional
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'optional'], optional);

    // Set Default
    if(hasDefault) { setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'default'], defaultValue); }

    // Set Types
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'types'], {});
    types.forEach(tname => {
        setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'types', tname], {});
        setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'types', tname, 'expects'], {});
    });

}