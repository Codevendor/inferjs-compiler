import path from "node:path";
import { COLOR, LABEL } from "curry-console";

// Helpers
import {
    REG_JS_COMMENTS,
    REG_INFER_ID,
    REG_SPLIT_ON_SPACE,
    REG_INFER_FIX_COMMENTS,
    REG_INFER_PARSE_TAG_INFER_LINE,
    REG_INFER_PARSE_TAG_PARAM_LINE,
    REG_INFER_PARSE_TAG_AUTHOR,
    REG_INFER_PARSE_TAG_BORROWS,
    REG_INFER_PARSE_TAG_ENUM,
    REG_INFER_PARSE_TAG_MEMBER,
    REG_INFER_PARSE_TAG_TYPE,
    REG_INFER_PARSE_TAG_TYPEDEF,
    REG_INFER_PARSE_TAG_YIELDS,
    getLineNumber,
    fixComments,
    type_of,
    ripTypes
} from "../helpers/helpers.js";

// Tags
import {
    tagAbstract,
    tagAccess,
    tagAlias,
    tagAsync,
    tagAugments,
    tagAuthor,
    tagBorrows,
    tagCallback,
    tagClass,
    tagClassDesc,
    tagConstant,
    tagConstructs,
    tagCopyright,
    tagDefault,
    tagDeprecated,
    tagDescription,
    tagEnum,
    tagEvent,
    tagExample,
    tagExports,
    tagExternal,
    tagFile,
    tagFires,
    tagFunction,
    tagGenerator,
    tagGlobal,
    tagHideConstructor,
    tagIgnore,
    tagImplements,
    tagInfer,
    tagInferId,
    tagInheritDoc,
    tagInner,
    tagInstance,
    tagInterface,
    tagKind,
    tagLends,
    tagLicense,
    tagLink,
    tagListens,
    tagMember,
    tagMemberOf,
    tagMixes,
    tagModule,
    tagName,
    tagNameSpace,
    tagOverride,
    tagPackage,
    tagParam,
    tagPrivate,
    tagProperty,
    tagProtected,
    tagPublic,
    tagReadOnly,
    tagRequires,
    tagReturns,
    tagSee,
    tagSince,
    tagStatic,
    tagSummary,
    tagThis,
    tagThrows,
    tagTodo,
    tagTutorial,
    tagType,
    tagTypeDef,
    tagVariation,
    tagYields
} from "../tags/tags.js";

/**
 * The inferParser class
 * @name inferparser
 */
export class inferParser {

    // Private fields
    #args = {};
    #stat = false;
    #stats = {};
    #source = null;

    /** Gets the processed main arguments object. */
    get args() { return this.#args; }

    /** 
     * Sets the processed main arguments object. 
     * @param {object} value - The processed main arguments object.
     */
    set args(value) { this.#args = value; }

    /** Gets whether the parser is creating stats. */
    get stat() { return this.#stat; }

    /** 
     * Sets whether the parser is creating stats. 
     * @param {boolean} value - Whether to create stats.
     */
    set stat(value) { this.#stat = value; }

    /** Gets the stats for the parser. */
    get stats() { return this.#stats; }

    /** Gets the parsed source results. */
    get source() { return this.#source; }

    /** Gets the parsed source results. */
    set source(value) { this.#source = value; }

    /**
     * Constructor for the inferParser.
     * @param {object} args - The processed main arguments object.
     * @param {boolean} stat - Whether to calculate stats.
     */
    constructor(args = {}, stat = false) {

        this.args = args;
        this.#stat = stat;
        this.reset();

    }

    /** Resets the the InferJSCompiler. */
    reset() {

        // Reset source
        this.#source = {
            globals: {},
            infers: {}
        };

        // Reset Stats
        this.#stats = {};

    }

    /**
     * Parses the data into the private field #infers
     * @param {string} filePath - The file path
     * @param {string} fileData - The file data
     * @param {object} outputOptions - The output options.
     */
    parse(filePath, fileData, outputOptions) {

        // Variables
        let m;

        // Find string js string infers
        while ((m = REG_JS_COMMENTS.exec(fileData)) !== null) {

            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === REG_JS_COMMENTS.lastIndex) {
                REG_JS_COMMENTS.lastIndex++;
            }

            m.forEach((jsComment, groupIndex) => {
                if (groupIndex === 1) { this.#parseComment(filePath, fileData, jsComment, outputOptions) };
            });
        }

    }

    /**
     * Parses a js comment for infers.
     * @param {string} filePath - The file path where the comment was found.
     * @param {string} fileData - The full file data from the file.
     * @param {string} jsComment - The js comment being parsed.
     * @param {object} outputOptions - The output options.
     */
    #parseComment(filePath, fileData, jsComment, outputOptions) {

        // Parse the @inferid
        const m = jsComment.match(REG_INFER_ID);
        if (!m || m.length !== 2 || m[1].trim() === '') {
            const lineNumber = getLineNumber(fileData, jsComment);
            console.warn()('INFERJS-COMPILER', `JS Comment missing tag @inferid on Line: ${lineNumber}\nFile: ${filePath}\nComment:\n${jsComment}`);
            return;
        }

        const inferid = m[1];

        // Check if inferid already exists
        if (this.#source.infers.hasOwnProperty(inferid)) {
            const lineNumber = getLineNumber(fileData, jsComment) + (getLineNumber(jsComment, m[0]) - 1);
            throw Error(`\nTag @inferid with id (${inferid}), exists in multiple places! Please change to a more unique id.\n` +
                `-> File: ${this.#source.infers[inferid].file}, Line: ${this.#source.infers[inferid].line}\n` +
                `-> File: ${filePath}, Line: ${lineNumber}`);
            return;

        }

        // Get line of infer
        const lineNumber2 = getLineNumber(fileData, jsComment) + (getLineNumber(jsComment, m[0]) - 1);

        // Check environment fix file path
        let file = filePath;
        if (outputOptions.env.toLowerCase().startsWith('p')) {
            file = file.split(path.sep);
            file = file.pop();
        }

        // Add to infers
        this.#source.infers[inferid] = { file: file, line: lineNumber2, "@description": "", "@param": {} };

        // Fixup comments
        const lines = fixComments(jsComment);


        // Split into lines for parsing and remove starting * if one.
        //const lines = jsComment.split("\n").map(item => item.replace(REG_REMOVE_STARTING_ASTERISK, '').trim());

        // Declare loop variables
        let match, line, line2, rawLine, tag, dvalue;
        let tagArr = [];
        let pname = '';
        let types = [];
        let infers = [];
        let pdesc = '';

        // Loop through comment lines for parsing
        for (let i = 0; i < lines.length; i++) {

            // Reset vars
            match = undefined;

            // Trim every line
            line = lines[i];

            // For raw line
            rawLine = line;

            // Parse tag items
            tagArr = line.split(REG_SPLIT_ON_SPACE, 2);
            tag = tagArr.shift();

            // Check tag exists
            if (tag) {

                // Convert tag to lowercase
                tag = tag.toLowerCase();

                // Check if multiline comment
                if (tag[0] === '@') {

                    for (let ii = i + 1; ii < lines.length; ii++) {

                        // Trim every line
                        line2 = lines[ii].trim();

                        // Check if first character is *, remove
                        if (line2.length > 0 && line2[0] === '*') line2 = line2.slice(1).trimStart();

                        // Check if not a property then has newlines
                        if (line2[0] !== '@') {

                            // Add special newline tag for replacing later in descriptions.
                            line += "INFER:NL" + line2;

                        } else {

                            // Forward index
                            i = ii - 1;
                            break;
                        }

                    }
                }

            }

            // Switch tag for parsing parameters
            switch (tag) {

                // Do Nothing
                case undefined: break;

                case '@inferid':

                    // Set into array
                    this.#source.infers[inferid][tag] = inferid;

                    break;


                case '@author':

                    match = rawLine.match(REG_INFER_PARSE_TAG_AUTHOR);
                    if (!match || match.length !== 3) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = { name: match[1], email: match[2] };
                    break;

                case '@borrows':

                    match = rawLine.match(REG_INFER_PARSE_TAG_BORROWS);
                    if (!match || match.length !== 3) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = { path1: match[1], path2: match[2] };
                    break;

                case '@enum':

                    match = rawLine.match(REG_INFER_PARSE_TAG_ENUM);
                    if (!match || match.length !== 2) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = match[1];
                    break;

                case '@var':
                case '@member':

                    match = rawLine.match(REG_INFER_PARSE_TAG_MEMBER);
                    if (!match) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = { type: (match.length == 2 && match[1]) ? match[1] : '', name: (match.length === 3 && match[2]) ? match[2] : '' };
                    break;

                case '@abstract':
                case '@async':
                case '@virtual':
                case '@generator':
                case '@global':
                case '@hideconstructor':
                case '@ignore':
                case '@inheritdoc':
                case '@inner':
                case '@instance':
                case '@override':
                case '@package':
                case '@private':
                case '@protected':
                case '@public':
                case '@readonly':
                case '@static':

                    this.#source.infers[inferid][tag] = true;
                    break;


                case '@access':
                case '@alias':
                case '@arguments':
                case '@callback':
                case '@class':
                case '@constructor':
                case '@classdesc':
                case '@constant':
                case '@constructs':
                case '@copyright':
                case '@default':
                case '@defaultvalue':
                case '@deprecated':
                case '@extends':
                case '@enum':
                case '@event':
                case '@exports':
                case '@external':
                case '@host':
                case '@fires':
                case '@emits':

                case '@category':
                case '@func':
                case '@method':
                case '@function':
                case '@implements':
                case '@interface':
                case '@kind':
                case '@lends':
                case '@listens':
                case '@memberof':
                case '@memberof!':
                case '@mixes':
                case '@mixin':
                case '@module':
                case '@name':
                case '@namespace':
                case '@requires':
                case '@see':
                case '@since':
                case '@this':
                case '@variation':
                case '@version':

                    // Set into array
                    this.#source.infers[inferid][tag] = tagArr.shift().trim();

                    break;

                // Parse @param
                case '@param':

                    // Parse Match
                    match = line.match(REG_INFER_PARSE_TAG_PARAM_LINE);

                    // Must have 7 params
                    if (!match || match.length !== 7) break;

                    // Split types and trim
                    types = match[2].split('|').map(item => item.trim());

                    // Check match type for param name 
                    if (match[3]) {

                        // Split from default value
                        const keyvalue = match[3].split('=').map(item => item.trim());
                        pname = keyvalue.shift();
                        dvalue = keyvalue[0];
                        pdesc = (match[4] && typeof match[4] === 'string') ? match[4].trim() : '';

                    } else if (match[5]) {

                        pname = match[5].trim();
                        pdesc = (match[6] && typeof match[6] === 'string') ? match[6].trim() : '';

                    } else {
                        // None found
                        break;
                    }

                    if (!this.#source.infers[inferid]['@param'].hasOwnProperty(pname)) this.#source.infers[inferid]['@param'][pname] = {};
                    this.#source.infers[inferid]['@param'][pname]['description'] = pdesc.replace(REG_INFER_FIX_COMMENTS, "\n");
                    if (!this.#source.infers[inferid]['@param'][pname].hasOwnProperty('types')) this.#source.infers[inferid]['@param'][pname]['types'] = {};

                    types.forEach(tname => {
                        if (!this.#source.infers[inferid]['@param'][pname]['types'].hasOwnProperty(tname)) this.#source.infers[inferid]['@param'][pname]['types'][tname] = { "infers": {} };
                        this.#source.infers[inferid]['@param'][pname]['types'][tname]['default'] = dvalue;
                    });

                    break;

                // Parse '@infer'
                case '@infer':

                    // Parse Match
                    match = line.match(REG_INFER_PARSE_TAG_INFER_LINE);

                    // Must have 6 params
                    if (!match || match.length !== 6) break;

                    // Split types and trim
                    types = match[2].split('|').map(item => item.trim());

                    // Get the param name.
                    pname = match[3].trim();

                    // Split infers and trim
                    infers = match[4].split('|').map(item => item.trim());

                    // Get param description
                    pdesc = (match[5] && typeof match[5] === 'string') ? match[5].trim() : '';

                    if (!this.#source.infers[inferid]['@param'].hasOwnProperty(pname)) this.#source.infers[inferid]['@param'][pname] = {};
                    if (!this.#source.infers[inferid]['@param'][pname].hasOwnProperty('types')) this.#source.infers[inferid]['@param'][pname]['types'] = {};

                    types.forEach(tname => {

                        if (!this.#source.infers[inferid]['@param'][pname]['types'].hasOwnProperty(tname)) this.#source.infers[inferid]['@param'][pname]['types'][tname] = { "infers": {}, "default": undefined };

                        infers.forEach(infer => {

                            const items = infer.split('=').map(item => item.trim());
                            infer = items.shift();

                            if (!this.#source.infers[inferid]['@param'][pname]['types'][tname].hasOwnProperty(infer)) this.#source.infers[inferid]['@param'][pname]['types'][tname]['infers'][infer] = {};
                            if (!this.#source.infers[inferid]['@param'][pname]['types'][tname]['infers'][infer].hasOwnProperty('description')) this.#source.infers[inferid]['@param'][pname]['types'][tname]['infers'][infer]['description'] = pdesc.replace(REG_INFER_FIX_COMMENTS, "\n");
                            if (!this.#source.infers[inferid]['@param'][pname]['types'][tname]['infers'][infer].hasOwnProperty('value')) this.#source.infers[inferid]['@param'][pname]['types'][tname]['infers'][infer]['value'] = items[0];

                        });

                    });

                    break;


                case '@exception':
                case '@throws':



                    break;

                case '@return':
                case '@returns': tagReturns(this, line, inferid, tag); break;

                case '@description':
                case '@desc':

                    this.#source.infers[inferid]['@description'] = line.replace(REG_INFER_FIX_COMMENTS, "\n").trim();
                    break;

                case '@todo':
                case '@fileoverview':
                case '@overview':
                case '@file':
                case '@example':
                case '@license':
                case '@summary':

                    this.#source.infers[inferid][tag] = line.split(tag, 2)[1].replace(REG_INFER_FIX_COMMENTS, "\n").trim();
                    break;

                case '@tutorial':

                    if (!this.#source.infers[inferid].hasOwnProperty(tag)) {
                        this.#source.infers[inferid][tag] = [];
                    }

                    this.#source.infers[inferid][tag].push(tagArr.shift().trim());
                    break;

                case '@type':

                    match = line.match(REG_INFER_PARSE_TAG_TYPE);
                    if (!match || match.length !== 2) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = match[1].split('|').map(item => item.trim());
                    break;

                case '@typedef':

                    match = line.match(REG_INFER_PARSE_TAG_TYPEDEF);
                    if (!match || match.length !== 3) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = {
                        type: match[1].split('|').map(item => item.trim()),
                        name: match[2]
                    };
                    break;

                case '@yields':

                    match = line.match(REG_INFER_PARSE_TAG_YIELDS);
                    if (!match || match.length !== 3) throw new SyntaxError();
                    this.#source.infers[inferid][tag] = {
                        type: match[1].split('|').map(item => item.trim()),
                        "description": match[2].replace(REG_INFER_FIX_COMMENTS, "\n")
                    };
                    break;

                // Parse Description
                default:

                    // Check if tagged unhandled
                    if (tag[0] === '@') {
                        this.#source.infers[inferid][tag] = new ReferenceError(`InferCompiler does not know how to process tag (${tag})!`);
                        break;
                    }

                    // Method signature
                    this.#source.infers[inferid]['@description'] += (this.#source.infers[inferid]['@description'].length === 0) ? line : "\n" + line;

                    break;

            }

        }

    }

}