// Imports
import { COLOR, LABEL, ACTION } from "curry-console";
import { Table, printTable } from "console-table-printer";
import path from "node:path";
import { inferParser } from "./infer-parser.js";
import { buildInferObject, lstat, readDir, readFile, writeFile, type_of, resolvePaths } from "../helpers/helpers.js";

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
     * Parses an array list of input file or directory paths and outputs an InferObject.
     * @param {array} input - The array list of file or directory paths to input.
     * @param {object} inputOptions - The input list options for each input file.
     * @param {string} output - The file path to create the infer file.
     * @param {object} outputOptions - The output file options.
    */
    async parseFiles(input, inputOptions, output, outputOptions = {}) {

        // Check types
        if (type_of(input, true) !== 'array') throw new TypeError(`Incorrect type for method parseFiles, first parameter input, must be an array!`);
        if (type_of(inputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFiles, second parameter inputOptions, must be an object!`);
        if (type_of(output, true) !== 'undefined' && type_of(output, true) !== 'string') throw new TypeError(`Incorrect type for method parseFiles, third parameter output, must be an string!`);
        if (type_of(outputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFiles, fourth parameter outputOptions, must be an object!`);

        // Resolve and normalize paths
        input = await resolvePaths(input);
        output = await resolvePaths(output);

        // Loop through and get all directory files
        let files = [];
        for (let i = 0; i < input.length; i++) {

            const item = input[i];

            if (item.isDirectory) {

                // Recursive build inputs
                const list = await this.#getDirectoryList(item.path, inputOptions);
                files.push(item.path);
                files = files.concat(list);

            } else {
                files.push(item.path);
            }

        }

        // Push files back to input array
        input = files;

        // Resolve directories
        input = await resolvePaths(input);

        // Check for preview mode
        if (this.args.hasOwnProperty('preview')) {

            if (output.length === 0) output.push('-> Stdout');

            // Create preview
            console.info(ACTION.VERBOSE(false))(`PREVIEW MODE`, '');

            // Input
            const itable = new Table({
                columns: [
                    { name: "idx", alignment: "right" },
                    { name: "type", alignment: "right" },
                    { name: "Input Path(s)", alignment: "left", maxLen: 20 }
                ]
            });

            input.map((item, idx) => {
                const row = {
                    idx: idx,
                    type: (item.isDirectory) ? 'dir' : 'file',
                    "Input Path(s)": item.path
                };
                return itable.addRow(row, { color: 'white' });
            });
            itable.printTable();

            // Ouput
            const otable = new Table({
                columns: [
                    { name: "Output File Path", alignment: "left", maxLen: 20 }
                ]
            });
            output.map((item) => {
                return otable.addRow({ "Output File Path": item.path }, { color: 'white' });
            });
            otable.printTable();

            return;

        }

        //console.info()('PARSE-LIST',`Loading inputList: ${inputList} ...`);


        // Loop through files and parse
        for (let i = 0; i < input.length; i++) {

            // Check if folder skip
            if(input[i].isDirectory) continue;

            // Get file path
            const file = input[i].path;

            console.info()('READ-FILE', `Reading file: ${file} ...`);

            // Read in file
            const readResults = await readFile(file, inputOptions);

            // Throw Err
            if (!!readResults.err) throw readResults.err;

            // Convert readResults to string
            readResults.data = readResults.data.toString();

            console.info()('PARSE-FILE', `Parsing file: ${file} ...`);

            // Parse file to object
            this.parse(file, readResults.data, outputOptions);

        }

        // Build infer object
        const inferObject = buildInferObject(this.source, outputOptions?.module);

        // Check if output file
        if (output.length === 0) {

            // Output to console
            console.log(inferObject);
            process.exitCode = 0;
            return;

        }

        console.info()('WRITE-FILE', `Writing output file: ${output[0]} ...`);

        // Write file to output file with json
        const writeResults = await writeFile(output[0], inferObject, outputOptions);

        // Throw err
        if (!!writeResults.err) throw writeResults.err;

        console.info()('INFERJS-COMPILER', `Finished`);

    }

    /**
     * Parses a file that contains an array list of input file paths and outputs an infer file.
     * @param {string} input - The filepath that contains an array list of file paths to input.
     * @param {object} inputOptions - The input list options for each input file.
     * @param {string} output - The file path to create the infer file.
     * @param {object} outputOptions - The output file options.
     */
    async parseFileList(input, inputOptions, output, outputOptions = {}) {

        // Check types
        if (type_of(input, true) !== 'array') throw new TypeError(`Incorrect type for method parseFileList, first parameter input, must be an array!`);
        if (type_of(inputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFileList, second parameter inputOptions, must be an object!`);
        if (type_of(output, true) !== 'undefined' && type_of(output, true) !== 'string') throw new TypeError(`Incorrect type for method parseFileList, third parameter output, must be an string!`);
        if (type_of(outputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFileList, fourth parameter outputOptions, must be an object!`);

        // Resolve and normalize paths
        input = resolvePaths(input);
        //output = resolvePaths(output);

        if (input.length !== 1) throw new Error(`Input for parse-file-list must provide 1 file list path!`);

        //console.info()('INFERJS-COMPILER', `Loading inputFileList: ${input} ...`);

        // Read in file
        const readResults = await readFile(input[0], inputOptions);

        // Throw Err
        if (readResults.err) throw readResults.err;

        // Convert readResults to string
        readResults.data = readResults.data.toString();

        // Split the file lines and trim each
        input = readResults.data.split(inputOptions.delimiter).map(item => {

            item = item.trim();
            if (item.startsWith('"') && item.endsWith('"')) return item.slice(1, -1).trim();
            if (item.startsWith("'") && item.endsWith("'")) return item.slice(1, -1).trim();
            if (item.startsWith('`') && item.endsWith('`')) return item.slice(1, -1).trim();
            return item;

        });

        // Call parseFiles
        await this.parseFiles(input, inputOptions, output, outputOptions);

    }

    /**
     * Gets a directory list of sub folders and files.
     * @param {string} inputDirectory - The input directory to look in.
     * @param {object} inputOptions - The input directory options.
     * @returns 
     */
    async #getDirectoryList(inputDirectory, inputOptions) {

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

            if (results.stats.isDirectory() && inputOptions.hasOwnProperty('recursive') && inputOptions.recursive.toString().toLowerCase() === 'true') {

                // Add recursive files to list;
                const rfiles = await this.#getDirectoryList(itemPath, inputOptions);
                files = files.concat(rfiles);
                continue;

            } else if (results.stats.isDirectory()) {

                continue;

            } else {

                // Only allow specific file extensions
                if (inputOptions) {

                    // Check allowed extensions
                    if (inputOptions.hasOwnProperty('fileExtensions')) {

                        // Check if allowedExtensions is string or array of string;
                        if (typeof inputOptions.fileExtensions === 'string') {

                            let item = inputOptions.fileExtensions.trim().toLowerCase();

                            if (item && item[0] !== '.') item = '.' + item;

                            // Convert to array for checking
                            inputOptions.fileExtensions = [item];

                        } else if (typeof inputOptions.fileExtensions === 'object' && Array.isArray(inputOptions.fileExtensions)) {

                            // Convert list to all lowercase
                            inputOptions.fileExtensions = inputOptions.fileExtensions.map(item => {
                                item = item.trim().toLowerCase();
                                if (item[0] !== '.') item = '.' + item;
                                return item;
                            });

                        } else {

                            // Throw error
                            throw new TypeError(`Method parseDirectory(inputOptions.fileExtensions) must be a string or array of file extensions!`);

                        }

                        // Check if file is included
                        if (inputOptions.fileExtensions.includes(path.extname(itemPath).toLowerCase())) files.push(itemPath);

                    } else {

                        files.push(itemPath);
                    }

                }

            }

        }

        return files;

    }

}



