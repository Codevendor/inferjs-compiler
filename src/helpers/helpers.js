/** 
 * The helper methods for the inferjs-compiler.
 * @category helpers
 * @module inferjs-compiler
 */

// Helper Regex Constants
export {
    REG_JS_COMMENTS,
    REG_REMOVE_STARTING_ASTERISK,
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
    REG_INFER_PARSE_TAG_YIELDS

} from "./regex-const.js";

// Helper methods
export { buildInferObject } from "./build-infer-object.js";
export { fileExists } from "./file-exists.js";
export { getLineNumber } from "./get-line-number.js";
export { jsonLoader } from "./json-loader.js";
export { loadMeta } from "./load-meta.js";
export { lstat } from "./lstat.js";
export { parseArgv } from "./parse-argv.js";
export { readDir } from "./read-dir.js";
export { readFile } from "./read-file.js";
export { resolvePaths } from "./resolve-paths.js";
export { ripTypes } from "./rip-types.js";
export { setValue } from "./set-value.js";
export { type_of } from "./type-of.js";
export { writeFile } from "./write-file.js";