'use strict';

// Imports
import { setValue } from "../helpers/set-value.js";

// Breaks apart the infer line into 5 groups.
const REG_TAG_INFER = /@infer\s{0,}{([^}]+)}\s{0,}([^\s]+)\s{0,}{([^}]+)}\s{0,}-{0,1}\s{0,}(.*)/ims;
const REG_TAG_INFER2 = /@infer\s{0,}{([^}]+)}\s{0,}{([^}]+)}\s{0,}-{0,1}\s{0,}(.*)/ims;

/**
 * Parses the tag @infer
 * @param {object} parser - The parser class.
 * @param {string} commentType - The comment type.
 * @param {string} filePath - The filepath of where the line exists.
 * @param {string} inferid - The inferid for the comment.
 * @param {object} lineObject - The lineObject to parse.
 * @param {string} name - The name of the variable or function.
 */
export function tagInfer(parser, commentType, filePath, inferid, lineObject, name) {

    // Must be 'methods' 
    if (commentType === 'methods') {

        // Parse Match
        let match = lineObject.line.match(REG_TAG_INFER);

        // Must have 7 params
        if (!match || match.length !== 5) {

            console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);
            return;
        }

        // Get types
        let types = match[1].trim();
        if (types.startsWith('(') && types.endsWith(')')) {
            types = types.slice(1, -1).trim();
        }
        types = types.split('|').map(item => item.trim());

        // Get name, optional, defaultValue
        let name2 = match[2].trim();

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
                setValue(parser.source, [commentType, 'infers', inferid, '@param', name2, 'types', tname, 'expects', expect.key], { description: description, value: expect.value }, true);

            });

        });

    } else {

        // Parse Match
        let match = lineObject.line.match(REG_TAG_INFER2);

        // Must have 7 params
        if (!match || match.length !== 4) {

            console.warn()('INFERJS-COMPILER', `Incorrect Syntax for Tag (${lineObject.tag})!\nFile: ${filePath}\nLine: ${lineObject.lineNumber}`);
            return;
        }

        // Get types
        let types = match[1].trim();
        if (types.startsWith('(') && types.endsWith(')')) {
            types = types.slice(1, -1).trim();
        }
        types = types.split('|').map(item => item.trim());

        // Get name, optional, defaultValue
        //let name = match[2].trim();

        // Get expectations
        let expects = match[2].trim();
        expects = expects.split('|').map(item => {

            // Break apart if =
            const expectParts = item.split('=');
            return {
                key: expectParts[0],
                value: (expectParts.length === 2) ? expectParts[1] : undefined
            }

        });

        // Get description
        const description = match[3].trim();

        // Add expects to each type
        types.forEach(tname => {

            expects.map(expect => {

                // Set Param Name
                setValue(parser.source, [commentType, 'infers', inferid, 'types', tname, 'expects', expect.key], { description: description, value: expect.value }, true);

            });

        });

    }
}