'use strict';

/**
 * Parses a string of infers into an object.
 * @param {string} text - The string to examine for infers. 
 */
export function parseInfers(text) {

    // The built obj
    let obj = {};

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
            return ["\n", "\r"].includes(buf[idx]);
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
                    case ']': return obj;

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
            const name = parseParamName();



            //console.log("Next Char:", peek());

        };

        // Parses the tag if not implemented.
        const parseTagNotImplemented = (tag) => {

            obj[tag] = new SyntaxError(`Block tag(${tag}) not implemented!`);

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


        // Parse the line
        const parseLines = () => {

            let description = '';

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
                            obj['description'] = description;

                            return;
                        }

                        // Add to description
                        description += peek();

                        break;

                    // Parse Description
                    default:

                        // Add to description
                        description += ((description === '') ? "" : "\n") + parseDesc();

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
                    parseLines();
                }

                return;

                next();

            }

        }

        // Start process
        parseComments();

    } catch (err) {

        return err;

    }

    // Return the obj.
    return obj;

}