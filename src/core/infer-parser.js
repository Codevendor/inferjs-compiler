import path from "node:path";
import { COLOR, LABEL } from "curry-console";

// Get js multi line comment tags
export const REG_JS_COMMENTS = /\/[\*]{2}[^\*]\s{0,}(.*?)\s{0,}\*\//gms;

// Get the @inferid
export const REG_INFER_ID = /@inferid\s{0,}([^\s]+)/ims;

// Get the @type or @const
export const REG_TYPE_OR_CONST = /@type\s{0,}{([^}]+)}\s{0,}-{0,}\s{0,}(.*)|@const\s{0,}{([^}]+)}\s{0,}-{0,}\s{0,}(.*)|@constant\s{0,}{([^}]+)}\s{0,}-{0,}\s{0,}(.*)/mis;

// Helpers
import {
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

        // Comment type
        let commentType = 'methods';

        // Get the comment line number
        const commentLineNumber = getLineNumber(fileData, jsComment);

        // Parse the @inferid
        let m = jsComment.match(REG_INFER_ID);
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

        // Check if method or variable comment
        m = jsComment.match(REG_TYPE_OR_CONST);
        if(m && m.length > 0) {
            commentType = 'variables';
        }

        // Build source
        setValue(this.#source, [commentType, 'infers', inferid, 'file'], file);
        setValue(this.#source, [commentType, 'infers', inferid, 'line'], commentLineNumber);
        setValue(this.#source, [commentType, 'infers', inferid, 'line-inferid'], lineNumber2);
        setValue(this.#source, [commentType, 'infers', inferid, 'description'], comment.desc);

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
                case '@virtual':
                case '@abstract': tagAbstract(this, commentType, filePath, inferid, line ); break;

                // @access
                case '@access': tagAccess(this, commentType, filePath, inferid, line ); break;

                // @alias
                case '@alias': tagAlias(this, commentType, filePath, inferid, line ); break;

                // @async
                case '@async': tagAsync(this, commentType, filePath, inferid, line ); break;

                // @augments
                case '@extends':
                case '@augments': tagAugments(this, commentType, filePath, inferid, line ); break;

                // @author
                case '@author': tagAuthor(this, commentType, filePath, inferid, line ); break;

                // @borrows
                case '@borrows': tagBorrows(this, commentType, filePath, inferid, line ); break;

                // @callback
                case '@callback': tagCallback(this, commentType, filePath, inferid, line ); break;

                // @classdesc
                case '@classdesc': tagClassDesc(this, commentType, filePath, inferid, line ); break;

                // @class
                case '@constructor':
                case '@class': tagClass(this, commentType, filePath, inferid, line ); break;

                // @constant
                case '@const':
                case '@constant': tagConstant(this, commentType, filePath, inferid, line ); break;

                // @constructs
                case '@constructs': tagConstructs(this, commentType, filePath, inferid, line ); break;

                // @copyright
                case '@copyright': tagCopyright(this, commentType, filePath, inferid, line ); break;

                // @defaults
                case '@defaultvalue':
                case '@default': tagDefault(this, commentType, filePath, inferid, line ); break;

                // @deprecated
                case '@deprecated': tagDeprecated(this, commentType, filePath, inferid, line ); break;

                // @description
                case '@desc':
                case '@description': tagDescription(this, commentType, filePath, inferid, line ); break;

                // @enum
                case '@enum': tagEnum(this, commentType, filePath, inferid, line ); break;

                // @event
                case '@event': tagEvent(this, commentType, filePath, inferid, line ); break;

                // @example
                case '@example': tagExample(this, commentType, filePath, inferid, line ); break;

                // @exports
                case '@exports': tagExports(this, commentType, filePath, inferid, line ); break;

                // @external
                case '@host':
                case '@external': tagExternal(this, commentType, filePath, inferid, line ); break;

                // @file
                case '@fileoverview':
                case '@overview':
                case '@file': tagFile(this, commentType, filePath, inferid, line ); break;

                // @fires
                case '@emits':
                case '@fires': tagFires(this, commentType, filePath, inferid, line ); break;

                // @function
                case '@func':
                case '@method':
                case '@function': tagFunction(this, commentType, filePath, inferid, line ); break;

                // @generator
                case '@generator': tagGenerator(this, commentType, filePath, inferid, line ); break;

                // @global
                case '@global': tagGlobal(this, commentType, filePath, inferid, line ); break;

                // @hideconstructor
                case '@hideconstructor': tagHideConstructor(this, commentType, filePath, inferid, line ); break;

                // @ignore
                case '@ignore': tagIgnore(this, commentType, filePath, inferid, line ); break;

                // @implements
                case '@implements': tagImplements(this, commentType, filePath, inferid, line ); break;

                // @inferid
                case '@inferid': tagInferId(this, commentType, filePath, inferid, line ); break;

                // @infer
                case '@infer': tagInfer(this, commentType, filePath, inferid, line ); break;

                // @inheritdoc
                case '@inheritdoc': tagInheritDoc(this, commentType, filePath, inferid, line ); break;

                // @inner
                case '@inner': tagInner(this, commentType, filePath, inferid, line ); break;

                // @instance
                case '@instance': tagInstance(this, commentType, filePath, inferid, line ); break;

                // @interface
                case '@interface': tagInterface(this, commentType, filePath, inferid, line ); break;

                // @kind
                case '@kind': tagKind(this, commentType, filePath, inferid, line ); break;

                // @lends
                case '@lends': tagLends(this, commentType, filePath, inferid, line ); break;

                // @license
                case '@license': tagLicense(this, commentType, filePath, inferid, line ); break;

                // @link
                case '@link': tagLink(this, commentType, filePath, inferid, line ); break;

                // @listens
                case '@listens': tagListens(this, commentType, filePath, inferid, line ); break;

                // @memberof
                case '@memberof': tagMemberOf(this, commentType, filePath, inferid, line ); break;

                // @member
                case '@var':
                case '@member': tagMember(this, commentType, filePath, inferid, line ); break;

                // @mixes
                case '@mixes': tagMixes(this, commentType, filePath, inferid, line ); break;

                // @mixin
                case '@mixin': tagMixin(this, commentType, filePath, inferid, line ); break;

                // @module
                case '@module': tagModule(this, commentType, filePath, inferid, line ); break;

                // @name
                case '@name': tagName(this, commentType, filePath, inferid, line ); break;

                // @namespace
                case '@namespace': tagNameSpace(this, commentType, filePath, inferid, line ); break;

                // @override
                case '@override': tagOverride(this, commentType, filePath, inferid, line ); break;

                // @package
                case '@package': tagPackage(this, commentType, filePath, inferid, line ); break;

                // @param
                case '@arg':
                case '@argument':
                case '@param': tagParam(this, commentType, filePath, inferid, line); break;

                // @private
                case '@private': tagPrivate(this, commentType, filePath, inferid, line ); break;

                // @property
                case '@prop':
                case '@property': tagProperty(this, commentType, filePath, inferid, line ); break;

                // @protected
                case '@protected': tagProtected(this, commentType, filePath, inferid, line ); break;

                // @public
                case '@public': tagPublic(this, commentType, filePath, inferid, line ); break;

                // @readonly
                case '@readonly': tagReadOnly(this, commentType, filePath, inferid, line ); break;

                // @requires
                case '@requires': tagRequires(this, commentType, filePath, inferid, line ); break;

                // @returns
                case '@return':
                case '@returns': tagReturns(this, commentType, filePath, inferid, line ); break;

                // @see
                case '@see': tagSee(this, commentType, filePath, inferid, line ); break;

                // @since
                case '@since': tagSince(this, commentType, filePath, inferid, line ); break;

                // @static
                case '@static': tagStatic(this, commentType, filePath, inferid, line ); break;

                // @summary
                case '@summary': tagSummary(this, commentType, filePath, inferid, line ); break;

                // @this
                case '@this': tagThis(this, commentType, filePath, inferid, line ); break;

                // @throws
                case '@exception':
                case '@throws': tagThrows(this, commentType, filePath, inferid, line ); break;

                // @todo
                case '@todo': tagTodo(this, commentType, filePath, inferid, line ); break;

                // @tutorial
                case '@tutorial': tagTutorial(this, commentType, filePath, inferid, line ); break;

                // @typedef
                case '@typedef': tagTypeDef(this, commentType, filePath, inferid, line ); break;

                // @type
                case '@type': tagType(this, commentType, filePath, inferid, line ); break;

                // @variation
                case '@variation': tagVariation(this, commentType, filePath, inferid, line ); break;

                // @version
                case '@version': tagVersion(this, commentType, filePath, inferid, line ); break;

                // @yields
                case '@yield':
                case '@yields': tagYields(this, commentType, filePath, inferid, line ); break;

                // No tag
                default: tagNoTag(this, commentType, filePath, inferid, line ); break;

            }

        }

    }

}