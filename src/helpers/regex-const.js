'use strict';

// Newline split
export const REG_NEWLINES = /\r?\n/g;

// Get js multi line comment tags
export const REG_JS_COMMENTS = /\/[\*]{2}[^\*]\s{0,}(.*?)\s{0,}\*\//gms;

// Removes starting asterisk if any
export const REG_REMOVE_STARTING_ASTERISK = /^[\s]{0,}[*]{1}[\s]{0,}/mis;

// Get the @inferid
export const REG_INFER_ID = /@inferid\s{0,}([^\s]+)/ims;

// Split on any space
export const REG_SPLIT_ON_SPACE = /\s/ims;

// Fix multiline comments across tags.
export const REG_INFER_FIX_COMMENTS = /INFER:NL/gmis;

// Parse Author
export const REG_INFER_PARSE_TAG_AUTHOR = /@author\s{1,}([^<]+)\s{1,}<([^>]+)>/ims;

// Parse borrows
export const REG_INFER_PARSE_TAG_BORROWS = /@borrows\s{1,}([^\s]+)\s{1,}as\s{1,}([^\s]+)/ims;

// Parse Enum
export const REG_INFER_PARSE_TAG_ENUM = /@enum\s{1,}\{{0,1}([^}{]+)\}{0,1}/ims;

// Parse Member 
export const REG_INFER_PARSE_TAG_MEMBER = /@member\s{1,}\{{0,1}([^}{]+)\}{0,1}\s{0,}([^\s]+)?/ims;

// Parse type
export const REG_INFER_PARSE_TAG_TYPE = /@type\s{1,}\{{0,1}\({0,1}([^}{)(]+)\){0,1}\}{0,1}/ims;

// Parse typedef
export const REG_INFER_PARSE_TAG_TYPEDEF = /@typedef\s{1,}\{{0,1}\({0,1}([^}{)(]+)\){0,1}\}{0,1}\s{1,}([^\s]+)/ims;

// Parse yields
export const REG_INFER_PARSE_TAG_YIELDS = /@yields\s{1,}\{{0,1}\({0,1}([^}{)(]+)\){0,1}\}{0,1}\s{0,}-{0,1}\s{0,}(.*)?/ims;