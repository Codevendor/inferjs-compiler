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
    ripTypes,
    setValue
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
    tagMixin,
    tagModule,
    tagName,
    tagNameSpace,
    tagNoTag,
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
    tagVersion,
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
            methods: {
                infers: {}
            },
            variables: {
                infers: {}
            }
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

        // Get the comment line number
        const commentLineNumber = getLineNumber(fileData, jsComment);

        // Parse the @inferid
        const m = jsComment.match(REG_INFER_ID);
        if (!m || m.length !== 2 || m[1].trim() === '') {
            const lineNumber = getLineNumber(fileData, jsComment);
            console.warn()('INFERJS-COMPILER', `JS Comment missing tag @inferid on Line: ${lineNumber}\nFile: ${filePath}\nComment:\n${jsComment}`);
            return;
        }

        const inferid = m[1];

        // Check if inferid already exists
        if (this.#source.methods.infers.hasOwnProperty(inferid)) {
            const lineNumber = getLineNumber(fileData, jsComment) + (getLineNumber(jsComment, m[0]) - 1);
            throw Error(`\nTag @inferid with id (${inferid}), exists in multiple places! Please change to a more unique id.\n` +
                `-> File: ${this.#source.methods.infers[inferid].file}, Line: ${this.#source.methods.infers[inferid].line}\n` +
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

        // Fixup comments
        const comment = fixComments(jsComment, commentLineNumber);

        // Build source
        setValue(this.#source, ['methods', 'infers', inferid, 'file'], file);
        setValue(this.#source, ['methods', 'infers', inferid, 'line'], commentLineNumber);
        setValue(this.#source, ['methods', 'infers', inferid, 'line-inferid'], lineNumber2);
        setValue(this.#source, ['methods', 'infers', inferid, 'description'], comment.desc);

        // Declare loop variables
        let match, dvalue;
        let tagArr = [];
        let pname = '';
        let types = [];
        let infers = [];
        let pdesc = '';

        // Loop through comment lines for parsing
        for (let i = 0; i < comment.lines.length; i++) {

            // Reset vars
            match = undefined;

            // Set line
            const line = comment.lines[i];

            // Set Tag
            const tag = comment.lines[i].tag;

            // Switch tag for parsing parameters
            switch (tag) {

                // @abstract
                case '@abstract': tagAbstract(); break;

                // @access
                case '@access': tagAccess(); break;

                // @alias
                case '@alias': tagAlias(); break;

                // @async
                case '@async': tagAsync(); break;

                // @augments
                case '@augments': tagAugments(); break;

                // @author
                case '@author': tagAuthor(); break;

                // @borrows
                case '@borrows': tagBorrows(); break;

                // @callback
                case '@callback': tagCallback(); break;

                // @classdesc
                case '@classdesc': tagClassDesc(); break;

                // @class
                case '@class': tagClass(); break;

                // @constant
                case '@constant': tagConstant(); break;

                // @constructs
                case '@constructs': tagConstructs(); break;

                // @copyright
                case '@copyright': tagCopyright(); break;

                // @defaults
                case '@default': tagDefault(); break;

                // @deprecated
                case '@deprecated': tagDeprecated(); break;

                // @description
                case '@description': tagDescription(); break;

                // @enum
                case '@enum': tagEnum(); break;

                // @event
                case '@event': tagEvent(); break;

                // @example
                case '@example': tagExample(); break;

                // @exports
                case '@exports': tagExports(); break;

                // @external
                case '@external': tagExternal(); break;

                // @file
                case '@file': tagFile(); break;

                // @fires
                case '@fires': tagFires(); break;

                // @function
                case '@function': tagFunction(); break;

                // @generator
                case '@generator': tagGenerator(); break;

                // @global
                case '@global': tagGlobal(); break;

                // @hideconstructor
                case '@hideconstructor': tagHideConstructor(); break;

                // @ignore
                case '@ignore': tagIgnore(); break;

                // @implements
                case '@implements': tagImplements(); break;

                // @inferid
                case '@inferid': tagInferId(); break;

                // @infer
                case '@infer': tagInfer(); break;

                // @inheritdoc
                case '@inheritdoc': tagInheritDoc(); break;

                // @inner
                case '@inner': tagInner(); break;

                // @instance
                case '@instance': tagInstance(); break;

                // @interface
                case '@interface': tagInterface(); break;

                // @kind
                case '@kind': tagKind(); break;

                // @lends
                case '@lends': tagLends(); break;

                // @license
                case '@license': tagLicense(); break;

                // @link
                case '@link': tagLink(); break;

                // @listens
                case '@listens': tagListens(); break;

                // @memberof
                case '@memberof': tagMemberOf(); break;

                // @member
                case '@member': tagMember(); break;

                // @mixes
                case '@mixes': tagMixes(); break;

                // @mixin
                case '@mixin': tagMixin(); break;

                // @module
                case '@module': tagModule(); break;

                // @name
                case '@name': tagName(); break;

                // @namespace
                case '@namespace': tagNameSpace(); break;

                // @override
                case '@override': tagOverride(); break;

                // @package
                case '@package': tagPackage(); break;

                // @param
                case '@param': tagParam(this, filePath, inferid, line); break;

                // @private
                case '@private': tagPrivate(); break;

                // @property
                case '@property': tagProperty(); break;

                // @protected
                case '@protected': tagProtected(); break;

                // @public
                case '@public': tagPublic(); break;

                // @readonly
                case '@readonly': tagReadOnly(); break;

                // @requires
                case '@requires': tagRequires(); break;

                // @returns
                case '@return':
                case '@returns': tagReturns(); break;

                // @see
                case '@see': tagSee(); break;

                // @since
                case '@since': tagSince(); break;

                // @static
                case '@static': tagStatic(); break;

                // @summary
                case '@summary': tagSummary(); break;

                // @this
                case '@this': tagThis(); break;

                // @throws
                case '@throws': tagThrows(); break;

                // @todo
                case '@todo': tagTodo(); break;

                // @tutorial
                case '@tutorial': tagTutorial(); break;

                // @typedef
                case '@typedef': tagTypeDef(); break;

                // @type
                case '@type': tagType(); break;

                // @variation
                case '@variation': tagVariation(); break;

                // @version
                case '@version': tagVersion(); break;

                // @yields
                case '@yields': tagYields(); break;

                // No tag
                default: tagNoTag(); break;

            }

        }

    }

}