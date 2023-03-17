'use strict';

const REG_REMOVE_COMMENTS = /\/\*(.*?)\*\//gmsi;
const REG_NEWLINES = /\r?\n/g;
const REG_SPLIT_ON_SPACE = /\s/ims;
const REG_VAR = /\s{0,}var\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_CONST = /\s{0,}const\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_LET = /\s{0,}let\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_FUNCTION = /\s{0,}function\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_NAME = /\s{0,}([^\s=;\)\(,:]+)/ims;
const REG_GET = /\s{0,}get\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_SET = /\s{0,}set\s{1,}([^\s=;\)\(,:]+)/ims;
const REG_CLASS = /\s{0,}class\s{1,}([^\s=;\)\(,:]+)/ims;

/**
 * Gets the name of variable, class or method, from the next following line.
 * @param {string} fileData - The fileData to look in.
 * @param {string} jsCommentRaw - The jsCommentRaw unparsed.
 * @param {number} startPos - The jscomment start position.
 * @returns {string} - The name it found.
 */
export function getName(fileData, jsCommentRaw, jsCommentPos) {

    // Get buffer
    const buffer = fileData.slice(jsCommentRaw.length + jsCommentPos).replace(REG_REMOVE_COMMENTS, '');

    // Eat characters until
    let i = 0;
    for (i = 0; i < buffer.length; i++) {
        if (![" ", "\v", "\f", "\n", "\r", "\t"].includes(buffer[i])) break;
    }

    // Reserved js words
    const resv = [
        "async", "abstract", "arguments", "await", "boolean",
        "break", "byte", "case", "catch",
        "char", "class", "const", "continue",
        "debugger", "default", "delete", "do",
        "double", "else", "enum", "eval",
        "export", "extends", "false", "final",
        "finally", "float", "for", "function",
        "goto", "if", "implements", "import",
        "in", "instanceof", "int", "interface",
        "let", "long", "native", "new",
        "null", "package", "private", "protected",
        "public", "return", "short", "static",
        "super", "switch", "synchronized", "this",
        "throw", "throws", "transient", "true",
        "try", "typeof", "var", "void",
        "volatile", "while", "with", "yield"];

    // Parse out line
    const line = buffer.slice(i).split(REG_NEWLINES)[0];
    const names = line.split(REG_SPLIT_ON_SPACE);
    let name = '';
    let m;

    for (i = 0; i < names.length; i++) {

        name = names[i].trim();

        switch (name) {

            case 'class' :

                m = line.match(REG_CLASS);
                if (m && m.length === 2) {
                    return m[1];
                }
                break;

            case 'get':

                m = line.match(REG_GET);
                if (m && m.length === 2) {
                    return m[1];
                }
                break;

            case 'set':

                m = line.match(REG_SET);
                if (m && m.length === 2) {
                    return m[1];
                }
                break;

            case 'var':

                m = line.match(REG_VAR);
                if (m && m.length === 2) {
                    return m[1];
                }

                break;

            case 'let':

                m = line.match(REG_LET);
                if (m && m.length === 2) {
                    return m[1];
                }

                break;

            case 'const':

                m = line.match(REG_CONST);
                if (m && m.length === 2) {
                    return m[1];
                }

                break;

            case 'function':

                m = line.match(REG_FUNCTION);
                if (m && m.length === 2) {
                    return m[1];
                }

                break;

            default:

                // Empty or reserved continue
                if (name === '' || resv.includes(name)) continue;

                m = line.match(REG_NAME);
                if (m && m.length === 2) {
                    return m[1];
                }

                return 'unknown';

                break;

        }

        //name = names[i].split(';')[0].trim().split('=')[0].trim();

        //if(!resv.includes(name)) break;

    }


    console.log(name);

}