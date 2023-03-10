'use strict';

// Imports
import { setValue } from "../helpers/helpers.js";

/**
 * Parses a string of infers into an object.
 * @param {string} text - The string to examine for infers. 
 */
export function parseInfers(text) {

    // The built obj
    let obj = {};

    // Temp Obj
    let temp = {};

    try {

        // Check text
        if (typeof text !== 'string' || text.trim() === '') {
            throw SyntaxError(`Method parseInfers() first parameter (text), must be a non empty string.`);
        }

        // The cursor index position.
        let idx = 0;

        // The length of the text.
        const len = text.length;

        // The buffer of the text.
        const buf = text;

        /** 
         * Peeks the current character without increasing cursor. 
         * @returns {string} - The current character.
         */
        const peek = () => {
            return buf[idx];
        };

        /** Pees Previous character without increasing cursor. */
        const peekPrev = () => {
            return buf[idx - 1];
        }

        /** 
         * Peeks the next character without increasing cursor. 
         * @returns {string} - The next character.
         */
        const peekNext = () => {
            return buf[idx + 1];
        };

        /** Increases cursor by 1. */
        const next = () => {
            idx++;
        };

        /** Checks if end of line. */
        const eol = () => {
            return ["\n", "\r"].includes(peek());
        };

        /** Checks for end of text. */
        const eof = () => {
            return (idx >= len);
        };

        /** 
         * Jump to text and increase cursor. 
         * @param {string} text - The text to jump to.
         */
        const jump = (text) => {
            idx = buf.indexOf(text, idx);
        };

        /** 
         * Checks if next line is param or continued description. 
         * @returns {boolean} - Whether param is on next line.
         */
        const peekParam = () => {

            const idx2 = idx + 1;
            let pos = [];
            const pos1 = buf.indexOf("\r", idx2);
            const pos2 = buf.indexOf("\n", idx2);

            if (pos1 > -1) pos.push(pos1);
            if (pos2 > -1) pos.push(pos2);

            pos = Math.min(...pos);

            let line = buf.substring(idx2, pos).trim();

            // check first char
            line = line.slice(1).trim()[0];

            if(line === '@') return true;

            return false;
            //console.log(line);


        }

        /** 
         * Expects a char and eats it or throws an error if doesnt exist.
         * @param {string} char - The character to consume or throw error.
         */
        const expectChar = (char) => {

            if (char !== peek()) {
                throw new SyntaxError(`Expected char ($char) found (${peek()})!`);
            }

            idx++;
            return true;

        };

        /** Finds comment start and increases cursor position. */
        const commentStart = () => {
            idx = buf.indexOf("/**", idx);
            idx += 3;
        };

        /** 
         * Checks if comment end and increases cursor position. 
         * @returns {boolean} - Whether comment end found at current position.
         */
        const commentEnd = () => {

            if ((peekPrev() + peek()) === "*/") {
                idx += 1;
                return true;
            }

            return false;
        };

        /** Eats and asterisk if exists and increases cursor position. */
        const eatAsterisk = () => {
            if (buf[idx] === '*') {
                idx++;
                return true;
            } else {
                return false;
            }
        };

        /** Checks if space character without increasing cursor. */
        const peekSpace = () => {

            return [" ", "\v", "\f", "\n", "\r", "\t"].includes(peek());

        }

        /** Skips space characters */
        const skipSpace = () => {

            while (!eof()) {

                // Exit if not space.
                if (!peekSpace()) return;

                // Pull next character
                next();
            }

        };

        /** Parses the tag name. */
        const parseTagName = () => {

            let tag = '';
            while (!eof()) {

                if ([' ', '\t'].includes(peek())) { return tag; }
                tag += peek();
                next();
            }

            return tag;

        };




        // Parses @category
        const parseTagCategory = () => {

            let text = '';

            skipSpace();

            while (!eof()) {

                // Check if end of line or space character.
                if (eol() || peekSpace()) {
                    obj['@category'] = text;
                    return;
                }
                text += peek();
                next();

            }

        }

        // Parses the param types
        const parseTypes = () => {

            let types = [];
            let type = '';

            skipSpace();

            while (!eof()) {

                switch (peek()) {

                    // Multiple type open do nothing
                    case '(': break;

                    // Add Type if recorded
                    case ')':
                    case '|':

                        // Add type to list if exists
                        if (type !== '') {
                            types.push(type);
                            type = '';
                        }
                        break;

                    // End Types
                    case '}':

                        // Add type to list if exists
                        if (type !== '') {
                            types.push(type);
                            type = '';
                        }
                        return types;

                    // Type 
                    default:

                        // Check for end of line 
                        if (eol()) return types;

                        type += peek();
                        break;
                }

                next();
            }

        };

        // Parses the param name
        const parseParamName = () => {

            const obj = { name: '', optional: false };

            let isValue = false;

            // Skip
            skipSpace();

            while (!eof()) {

                switch (peek()) {

                    // Optional parameter open
                    case '[':
                        obj.optional = true;
                        next();
                        skipSpace();
                        continue;

                    // Optional parameter close
                    case ']':
                        return obj;

                    // Assign defaut value
                    case '=':

                        isValue = true;
                        obj['default'] = '';
                        break;

                    // Space dont add for name
                    case ' ':

                        if (isValue) {

                            // Add to default
                            obj['default'] += peek();

                        } else {

                            // Exit name end
                            return obj;
                        }

                        break;

                    // Name characters
                    default:

                        // Check for end of line 
                        if (eol()) return obj;

                        if (isValue) {
                            obj['default'] += peek();
                        } else {
                            obj.name += peek();
                        }

                        break;

                }

                next();
            }

        }

        // Parses the param description.
        const parseParamDesc = () => {

            let desc = '';

            // The first character
            let first = true;

            // Skip
            skipSpace();

            while (!eof()) {

                switch (peek()) {

                    case '*':
                        skipSpace();
                        break;

                    case '-':

                        if (first) { 
                            first = false; 
                            next();
                            skipSpace();
                            continue; 
                        }

                        // Record now
                        desc += peek();

                        break;

                    case "\r":
                    case "\n":
                    
                        if(peekParam()){ 

                            return desc;

                        }

                        desc+=peek();

                        break;

                    default:

                        // Check for end of line 
                        if (eol()) return desc;

                        // Record
                        desc += peek();

                        break;

                }

                next();
            }
        };

        // Parse @param
        const parseTagParam = () => {

            //let text = '';

            // Skip
            skipSpace();

            // Expect
            expectChar('{');

            // Parse Types
            const types = parseTypes();

            // Expect
            expectChar('}');

            // Parse Name
            const nameObj = parseParamName();

            // Parse Tag @param Description.
            const desc = parseParamDesc();


            // Create @param object
            setValue(temp, ['@param'], {});
            setValue(temp, ['@param', nameObj.name], {});
            setValue(temp, ['@param', nameObj.name, 'description'], desc);
            setValue(temp, ['@param', nameObj.name, 'optional'], nameObj.optional);
            if (nameObj.hasOwnProperty('default')) {
                setValue(temp, ['@param', nameObj.name, 'default'], nameObj.default);
            }

            // Create @param types
            setValue(temp, ['@param', nameObj.name, 'types'], {});
            types.map(type => {

                setValue(temp, ['@param', nameObj.name, 'types', type], {});

                // Create @param types infers
                setValue(temp, ['@param', nameObj.name, 'types', type, 'infers'], {});
            });

        };

        // Parses the tag if not implemented.
        const parseTagNotImplemented = (tag) => {

            temp[tag] = new SyntaxError(`Block tag(${tag}) not implemented!`);

            // Read until eol
            while (!eof()) {
                if (eol()) return;
                next();
            }

        };

        // Parses a tag
        const parseTag = () => {

            // Get the tag and increase pointer position.
            const tag = parseTagName();

            console.log(`Found: ${tag}`);

            switch (tag) {

                // @category
                case '@category': parseTagCategory(); break;

                // @param
                case '@param': parseTagParam(); break;

                // Tag not found
                default: parseTagNotImplemented(tag); break;
            }


        };

        /** Parses the description. */
        const parseDesc = () => {

            let desc = '';

            while (!eof()) {

                if (eol()) {
                    return desc;
                }
                desc += peek();
                next();
            }

        };


        // Parse the comment
        const parseComment = () => {

            // Reset temp
            temp = { description: '', '@param': {} };

            while (!eof()) {

                // Skip the spaces
                skipSpace();

                // Remove single asterisk at start
                if (eatAsterisk()) skipSpace();

                // Check starting character
                switch (peek()) {

                    // Parse Tag
                    case '@':

                        parseTag();
                        break;

                    // Check for possible end of comment
                    case '/':

                        // Jump if end of comment
                        if (commentEnd()) {

                            // Add description to object
                            //temp.description = description;

                            return;
                        }

                        // Add to description
                        temp.description += peek();

                        break;

                    // Parse Description
                    default:

                        // Add to description
                        temp.description += ((temp.description === '') ? "" : "\n") + parseDesc();

                        break;
                }

                next();
            }

        };


        /** Parses the comments in a loop. */
        const parseComments = () => {

            while (!eof()) {

                // Find comment start
                commentStart();

                // Make sure not three ***
                if (peek() !== '*') {
                    // Parse Lines
                    parseComment();
                }

                next();

            }

        }

        // Start process
        parseComments();

    } catch (err) {

        console.log(err);
        return err;

    }

    // Return the obj.
    return obj;

}