'use strict';

/**
 * Creates a property and a value in an object.
 * @param {object} object - The object to create the property and value in.
 * @param {array} arrayPath - The array path of nested properties.
 * @param {any} value - The value to set the property with.
 * @param {boolean} overwrite - Whether to overwrite property if one exists.
 * @param {number} limit - The limit of the path.
 * @returns {object} - A Object
 * @inferid iniParser.setValue
 */
export function setValue(object, arrayPath, value, overwrite = false, limit) {

    const keys = arrayPath.slice(0, limit);
    const last = keys.pop();

    const obj = keys.reduce((o, k) => o[k] = o[k] || {}, object);
    if (overwrite || !obj.hasOwnProperty(last)) {
        obj[last] = value;
    }

    return object;

}