'use strict';

import path from "node:path";
import { type_of } from "./type-of.js";

/**
 * Rips the types apart and return an array.
 * @param {string} text - The text to rip the types apart.
 * @returns {array} - Returns a type array.
 */
export function ripTypes(text) {

    if (type_of(text) !== 'string') return [];

    // Trim string
    text = text.trim();

    // Check if surrounded by parenthesis
    if (text.startsWith('(') && text.endsWith(')')) {

        text = text.slice(1, -1);

        // Trim String 
        text = text.trim();

    }

    // Break apart types and trim
    return text.split('|').map(item => item.trim());

}