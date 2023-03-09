'use strict';

import { REG_INFER_PARSE_TAG_INFER_LINE, setValue } from "../helpers/helpers.js";

/**
 * Parses the tag @infer
 * @param {object} parser - The parser class.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid = The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 */
export function tagInfer(parser, filePath, inferid, lineObject) {

    // Parse Match
    let match = lineObject.line.match(REG_INFER_PARSE_TAG_INFER_LINE);

    // Must have 7 params
    if (!match || match.length !== 5) {

        console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (@infer)!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);

    }

    // Get types
    let types = match[1].trim();
    if (types.startsWith('(') && types.endsWith(')')) {
        types = types.slice(1, -1).trim();
    }
    types = types.split('|').map(item => item.trim());

    // Get name, optional, defaultValue
    let name = match[2].trim();

    // Get expectations
    let expects = match[3].trim();
    expects = expects.split('|').map(item => {

        // Break apart if =
        const expectParts = item.split('=');
        return {
            key: expectParts[0],
            value: (expectParts.length === 2) ? expectParts[1] : undefined
        }

    });

    // Get description
    const description = match[4].trim();


    // Add expects to each type
    types.forEach(tname => {

        expects.map(expect => {

            // Set Param Name
            setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types', tname, 'expects', expect.key], { description: description, value: expect.value }, true);

        });

    });





    // Set Param Description
    // setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'description'], description);

    // Set Optional
    //setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'optional'], optional);

    // Set Default
    //if (hasDefault) { setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'default'], defaultValue); }

    // Set Types
    //setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types'], {});
    //types.forEach(tname => {
    //    setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types', tname], {});
    //    setValue(parser.source, ['methods', 'infers', inferid, '@param', name, 'types', tname, 'expects'], {});
    //});

}