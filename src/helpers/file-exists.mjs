'use strict';

import fs from "node:fs";

/**
 * Checks if a file exists.
 * @param {string} filePath - The file to check if exists.
 * @returns {boolean} - Whether the file exists.
 */
export function fileExists(filePath) {

    return new Promise((resolve, reject) => {

        fs.access(filePath, fs.constants.F_OK, err => {
          resolve(!err);
        });

    });

}