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
 */
export function tagParam(parser, commentType, filePath, inferid, lineObject) {

    // Must be 'methods' 
    if(commentType==='variables') return;

    // Parse Match
    let match = lineObject.line.match(REG_TAG_PARAM);

    // Must have 7 params
    if (!match || match.length !== 7) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);

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

    // Get name, optional, defaultValue
    let name = match[2].trim();
    let optional = false;
    if(name.startsWith('[') && name.endsWith(']')) {
        optional = true;
        name = name.slice(1, -1).trim();
    }
    const nameParts = name.split('=').map(item => item.trim());
    name = nameParts[0];
    let defaultValue = undefined;
    let hasDefault = false;
    if(nameParts.length==2) {
        hasDefault = true;
        defaultValue = nameParts[1];
    }

    // Get description
    const description = match[3].trim();

    // Set Param Name
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name], {});

    // Set Param Description
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'description'], description);

    // Set Optional
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'optional'], optional);

    // Set Default
    if(hasDefault) { setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'default'], defaultValue); }

    // Set Types
    setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'types'], {});
    types.forEach(tname => {
        setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'types', tname], {});
        setValue(parser.source, [commentType, 'infers', inferid, '@param', name, 'types', tname, 'expects'], {});
    });

}