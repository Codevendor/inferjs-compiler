'use strict';

import { REG_INFER_PARSE_TAG_PARAM_LINE, setValue } from "../helpers/helpers.js";

/**
 * 
 * @param {object} parser - The parser class.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid = The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 */
export function tagParam(parser, filePath, inferid, lineObject) {

    // Parse Match
    let match = lineObject.line.match(REG_INFER_PARSE_TAG_PARAM_LINE);

    // Must have 7 params
    if (!match || match.length !== 7) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (@param)!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);

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
    setValue(parser.source, ['methods', 'infers', inferid, '@param', name], {});

    // Set Param Description
    setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'description'], description);

    // Set Optional
    setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'optional'], optional);

    // Set Default
    if(hasDefault) { setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'default'], defaultValue); }

    // Set Types
    setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types'], {});
    types.forEach(tname => {
        setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types', tname], {});
        setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types', tname, 'expects'], {});
    });

}