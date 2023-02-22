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
     * Parses an array list of input file paths and outputs an InferObject.
     * @param {array} input - The array list of file paths to input.
     * @param {object} inputOptions - The input list options for each input file.
     * @param {string} output - The file path to create the infer file.
     * @param {object} outputOptions - The output file options.
    */
    async parseFiles(input, inputOptions, output, outputOptions = {}) {

        // Check types
        if (type_of(input, true) !== 'array') throw new TypeError(`Incorrect type for method parseFiles, first parameter input, must be an array!`);
        if (type_of(inputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFiles, second parameter inputOptions, must be an object!`);
        if (type_of(output, true) !== 'string') throw new TypeError(`Incorrect type for method parseFiles, third parameter output, must be an string!`);
        if (type_of(outputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFiles, fourth parameter outputOptions, must be an object!`);

        // Resolve and normalize paths
        input = resolvePaths(input);
        output = resolvePaths(output);

        // Check for preview mode
        if (this.args.hasOwnProperty('preview')) {

            if (output.length === 0) output.push('-> Stdout');

            // Create preview
            console.info()(`PREVIEW MODE`, '');

            // Input
            const itable = new Table({
                columns: [
                    { name: "idx", alignment: "right" },
                    { name: "Input File Path(s)", alignment: "left", maxLen: 20 }
                ]
            });

            input.map((item, idx) => { itable.addRow({ idx: idx, "Input File Path(s)": item }, { color: 'white' }); });
            itable.printTable();

            // Ouput
            const otable = new Table({
                columns: [
                    { name: "Output File Path", alignment: "left", maxLen: 20 }
                ]
            });
            [output].map((item) => { otable.addRow({ "Output File Path": item }, { color: 'white' }); });
            otable.printTable();

            return;

        }

        //console.info()('PARSE-LIST',`Loading inputList: ${inputList} ...`);


        // Loop through files and parse
        for (let i = 0; i < input.length; i++) {

            const file = input[i];

            console.info()('READ-FILE', `Reading file: ${file} ...`);

            // Read in file
            const readResults = await readFile(file, inputOptions);

            // Throw Err
            if (!!readResults.err) throw readResults.err;

            // Convert readResults to string
            readResults.data = readResults.data.toString();

            console.info()('PARSE-FILE', `Parsing file: ${file} ...`);

            // Parse file to object
            this.parse(file, readResults.data);

        }

        // Build infer object
        const inferObject = buildInferObject(this.source, outputOptions?.['module']);

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



        /*
        // Check if preview mode
        if (!preview) {

            // Check if output file
            if (type_of(outputFile) === 'undefined' || outputFile.toString() === '') {

                // Output to console
                curr.verbose = true;
                console.log(inferObject);
                process.exitCode = 0;
                return;


            } else {

                if (!path.isAbsolute(outputFile)) {
                    outputFile = path.normalize(path.resolve(outputFile));
                }

            }

            console.info(LABEL.DEFAULT)('WRITE-FILE')(`Writing output file: ${outputFile} ...`);

            // Write file to output file with json
            const writeResults = await writeFile(outputFile, inferObject, outputFileOptions);

            // Throw err
            if (!!writeResults.err) throw writeResults.err;

            console.info(LABEL.DEFAULT)('INFERJS-COMPILER')(`Finished`);

        } else {

            // Check if output file
            if (type_of(outputFile) === 'undefined' || outputFile.toString() === '') {

                outputFile = '-> Stdout';

            } else {

                if (!path.isAbsolute(outputFile)) {
                    outputFile = path.normalize(path.resolve(outputFile));
                }

            }

            // Turn back on log
            curr.verbose = true;

            // Create preview
            console.info(LABEL.DEFAULT)(`PREVIEW MODE`)('');

            //Input List
            printTable(inputList.map((item, idx, arr) => { return { idx: idx, "Input File Paths": item }; }));

            // Ouput File
            printTable([outputFile].map((item, idx, arr) => { return { "Output File Path": item }; }));


        }
        */

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
        if (type_of(output, true) !== 'string') throw new TypeError(`Incorrect type for method parseFileList, third parameter output, must be an string!`);
        if (type_of(outputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseFileList, fourth parameter outputOptions, must be an object!`);

        // Check if inputFile is absolute path.
        if (!path.isAbsolute(input)) {
            input = path.resolve(input);
        }

        console.info()('INFERJS-COMPILER', `Loading inputFileList: ${input} ...`);

        // Read in file
        const readResults = await readFile(input, inputOptions);

        // Throw Err
        if (readResults.err) throw readResults.err;

        // Convert readResults to string
        readResults.data = readResults.data.toString();

        // Split the file lines and trim each
        const lines = readResults.data.split("\n").map(item => item.trim());

        // Call parseFiles
        await this.parseFiles(lines, inputOptions, outputFile, outputOptions);

    }

    /**
     * Parses a directory(s) looking for infers to process into an InferObject.
     * @param {array} input - The directory path(s) to parse.
     * @param {object} inputOptions - The file options for each file.
     * @param {string} output - Stdout output InferObject string or output file path to create the InferObject in.
     * @param {string} outputOptions - The output options.
     */
    async parseDirectories(input, inputOptions = {}, output, outputOptions = {}) {

        // Check types
        if (type_of(input, true) !== 'array') throw new TypeError(`Incorrect type for method parseDirectories, first parameter input, must be an array!`);
        if (type_of(inputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseDirectories, second parameter inputOptions, must be an object!`);
        if (type_of(output, true) !== 'string') throw new TypeError(`Incorrect type for method parseDirectories, third parameter output, must be an string!`);
        if (type_of(outputOptions, true) !== 'object') throw new TypeError(`Incorrect type for method parseDirectories, fourth parameter outputOptions, must be an object!`);


        // Check for preview
        //let preview = false;
        //if (this.args.hasOwnProperty('preview')) {

        //    preview = true;

        // Turn off log verbose
        //curr.verbose = false;
        //}

        //console.info()('PARSE-LIST',`Loading inputDirectoryList: ${inputDirectoryList} ...`);

        // Resolve and normalize paths
        input = resolvePaths(input);


        /*
        for (let i = 0; i < inputDirectoryList.length; i++) {

            // Check if input is absolute path.
            if (!path.isAbsolute(inputDirectoryList[i])) {
                inputDirectoryList[i] = path.normalize(path.resolve(inputDirectoryList[i]));
            }

        }
        */

        let files = [];
        for (let i = 0; i < input.length; i++) {
            const dir = input[i];
            const list = await this.#getDirectoryList(dir, inputOptions);
            files = files.concat(list);
        }


        // Get list of files for parsing
        //const files = await this.#getDirectoryList(inputDirectory, inputFileOptions);

        // Call parseFiles
        await this.parseFiles(files, inputOptions, output, outputOptions);
    }

    /**
     * Gets a directory list of sub folders and files.
     * @param {string} inputDirectory - The input directory to look in.
     * @param {object} inputFileOptions - The input directory options.
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



