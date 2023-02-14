// Imports
import path from "node:path";
import { COLOR } from "./logger.mjs";
import { inferParser } from "./infer-parser.mjs";
import { buildInferObject, lstat, readDir, readFile, writeFile, type_of } from "../helpers/helpers.mjs";

/**
 * The InferJSCompiler Class
 * @name InferJSCompiler
 */
export class InferJSCompiler extends inferParser {

    /**
     * Constructor for the InferJSCompiler. 
     * @param {object} args - The processed main arguments object.
     * @param {boolean} stat - Whether to calculate stats.
     */
    constructor(args = {}, stat = false) {

        super(args, stat);

    }

    /**
     * Parses an array list of input file paths and outputs an infer file.
     * @param {array} inputList - The array list of file paths to input.
     * @param {object} inputFileOptions - The input list options for each input file.
     * @param {string} outputFile - The file path to create the infer file.
     * @param {object} outputFileOptions - The output file options.
    */
    async parseFiles(inputList, inputFileOptions, outputFile, outputFileOptions = {}) {

        // Check types
        if (typeof inputList !== 'object' || !Array.isArray(inputList)) throw new TypeError(`Incorrect type for method parseList, parameter inputList must be an array!`);
        if (typeof inputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseList, parameter inputFileOptions must be an object!`);
        //if (typeof outputFile !== 'string') throw new TypeError(`Incorrect type for method parseList, parameter outputFile must be an string!`);
        if (typeof outputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseList, parameter outputFileOptions must be an object!`);

        console.info(COLOR.DEFAULT)('PARSE-LIST')(`Loading inputList: ${inputList} ...`);

        for (let i = 0; i < inputList.length; i++) {

            // Get the file
            let inputFile = inputList[i];

            // Check if inputFile is absolute path.
            if (!path.isAbsolute(inputFile)) {
                inputFile = path.resolve(inputFile);
            }

            console.info(COLOR.DEFAULT)('READ-FILE')(`Reading file: ${inputFile} ...`);

            // Read in file
            const readResults = await readFile(inputFile, inputFileOptions);

            // Throw Err
            if (!!readResults.err) throw readResults.err;

            // Convert readResults to string
            readResults.data = readResults.data.toString();

            console.info(COLOR.DEFAULT)('PARSE-FILE')(`Parsing file: ${inputFile} ...`);

            // Parse file to object
            this.parse(inputFile, readResults.data);

        }

        const inferObject = buildInferObject(this.source, outputFileOptions?.['module']);

        // Check if output file
        if (type_of(outputFile) === 'undefined' || outputFile.toString() === '') {

            // Output to console
            log.verbose = true;
            console.log(inferObject);
            process.exitCode = 0;
            return;

        }

        if (!path.isAbsolute(outputFile)) {
            outputFile = path.resolve(outputFile);
        }

        console.info(COLOR.DEFAULT)('WRITE-FILE')(`Writing output file: ${outputFile} ...`);

        // Write file to output file with json
        const writeResults = await writeFile(outputFile, inferObject, outputFileOptions);

        // Throw err
        if (!!writeResults.err) throw writeResults.err;

        console.info(COLOR.DEFAULT)('INFERJS-COMPILER')(`Finished`);

    }

    /**
     * Parses a file that conatins an array list of input file paths and outputs an infer file.
     * @param {string} inputFileList - The filepath that contains an array list of file paths to input.
     * @param {object} inputFileOptions - The input list options for each input file.
     * @param {string} outputFile - The file path to create the infer file.
     * @param {object} outputFileOptions - The output file options.
     */
    async parseFileList(inputFileList, inputFileOptions, outputFile, outputFileOptions = {}) {

        // Check types
        if (typeof inputFileList !== 'string') throw new TypeError(`Incorrect type for method parseFileList, parameter inputFileList must be a string!`);
        if (typeof inputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseFileList, parameter inputFileOptions must be an object!`);
        if (typeof outputFile !== 'string') throw new TypeError(`Incorrect type for method parseFileList, parameter outputFile must be an string!`);
        if (typeof outputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseFileList, parameter outputFileOptions must be an object!`);

        // Check if inputFile is absolute path.
        if (!path.isAbsolute(inputFileList)) {
            inputFileList = path.resolve(inputFileList);
        }

        console.info(COLOR.DEFAULT)('INFERJS-COMPILER')(`Loading inputFileList: ${inputFileList} ...`);

        // Read in file
        const readResults = await readFile(inputFileList, inputFileOptions);

        // Throw Err
        if (readResults.err) throw readResults.err;

        // Convert readResults to string
        readResults.data = readResults.data.toString();

        // Split the file lines and trim each
        const lines = readResults.data.split("\n").map(item => item.trim());

        // Call parseFiles
        await this.parseFiles(lines, inputFileOptions, outputFile, outputFileOptions);

    }

    /**
     * Parses a directory looking for infers.
     * @param {string} inputDirectory - The directory path to parse.
     * @param {object} inputFileOptions - The file options for each file.
     * @param {string} outputFile - The file path to create the infer file.
     * @param {string} outputFileOptions - The file options for the outputfile.
     */
    async parseDirectory(inputDirectory, inputFileOptions = {}, outputFile, outputFileOptions = {}) {

        // Check types
        if (typeof inputDirectory !== 'string') throw new TypeError(`Incorrect type for method parseFile, parameter inputDirectory must be a string!`);
        if (typeof inputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseFile, parameter inputFileOptions must be an object!`);
        if (typeof outputFile !== 'string') throw new TypeError(`Incorrect type for method parseFile, parameter outputFile must be an string!`);
        if (typeof outputFileOptions !== 'object') throw new TypeError(`Incorrect type for method parseFile, parameter outputFileOptions must be an object!`);

        // Check if inputDirectory is absolute path.
        if (!path.isAbsolute(inputDirectory)) {
            inputDirectory = path.resolve(inputDirectory);
        }

        // Get list of files for parsing
        const files = await this.#getDirectoryList(inputDirectory, inputFileOptions);

        // Call parseFiles
        await this.parseFiles(lines, inputFileOptions, outputFile, outputFileOptions);
    }

    /**
     * Gets a directory list of sub folders and files.
     * @param {*} inputDirectory - The input directory to look in.
     * @param {*} inputFileOptions - The input directory options.
     * @returns 
     */
    async #getDirectoryList(inputDirectory, inputFileOptions) {

        // Holds the files
        let files = [];

        const dir = await readDir(inputDirectory);

        // Throw error
        if (!!dir.err) throw dir.err;

        // Loop through directory items
        for (let i = 0; i < dir.files.length; i++) {

            const item = dir.files[i];

            const itemPath = (inputDirectory.endsWith(path.sep)) ? inputDirectory + item : inputDirectory + path.sep + item;

            // Check if file or directory
            const results = await lstat(itemPath, {});

            // Throw error
            if (!!results.err) throw results.err;

            if (results.stats.isDirectory() && inputFileOptions.hasOwnProperty('recursive') && inputFileOptions.recursive.toString().toLowerCase() === 'true') {

                // Add recursive files to list;
                const rfiles = await this.#getDirectoryList(itemPath, inputFileOptions);
                files = files.concat(rfiles);
                continue;

            } else if (results.stats.isDirectory()) {

                continue;

            } else {

                // Only allow specific file extensions
                if (inputFileOptions) {

                    // Check allowed extensions
                    if (inputFileOptions.hasOwnProperty('allowedExtensions')) {

                        // Check if allowedExtensions is string or array of string;
                        if (typeof inputFileOptions.allowedExtensions === 'string') {

                            let item = inputFileOptions.allowedExtensions.trim().toLowerCase();

                            if (item && item[0] !== '.') item = '.' + item;

                            // Convert to array for checking
                            inputFileOptions.allowedExtensions = [item];

                        } else if (typeof inputFileOptions.allowedExtensions === 'object' && Array.isArray(inputFileOptions.allowedExtensions)) {

                            // Convert list to all lowercase
                            inputFileOptions.allowedExtensions = inputFileOptions.allowedExtensions.map(item => {
                                item = item.trim().toLowerCase();
                                if (item[0] !== '.') item = '.' + item;
                                return item;
                            });

                        } else {

                            // Throw error
                            throw new TypeError(`Method parseDirectory(inputFileOptions.allowedExtensions) must be a string or array of file extensions!`);

                        }

                        // Check if file is included
                        if (inputFileOptions.allowedExtensions.includes(path.extname(itemPath).toLowerCase())) files.push(itemPath);

                    } else {

                        files.push(itemPath);
                    }

                }

            }

        }

        return files;

    }

}



