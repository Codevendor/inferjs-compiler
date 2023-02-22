#! /usr/bin/env node

// Imports
import { curryConsole, COLOR, LABEL } from "curry-console";
import { loadMeta, parseArgv, readFile, fileExists, jsonLoader } from "../src/helpers/helpers.js";
import { InferJSCompiler } from "../src/core/inferjs-compiler.js";
import path from "node:path";

// Load Meta
const meta = loadMeta(import.meta);
await jsonLoader(path.resolve(meta.__dirname, "../package.json"), 'info');

// curryConsole Settings
global.curr = new curryConsole();
curr.profile = true;
curr.verbose = true;
curr.defaultsLog = [];
curr.defaultsInfo = [LABEL.WHITE, LABEL.BG_BLUE, COLOR.BLUE];
curr.defaultsWarn = [LABEL.WHITE, LABEL.BG_YELLOW, COLOR.YELLOW];
curr.defaultsError = [LABEL.WHITE, LABEL.BG_RED, COLOR.RED];

/**
 * The main entry point into the CLI program.
 * @param {array} argv - The terminal parameters.
 */
export async function main(argv) {

    // Compiler requires more than 1 parameter
    if (argv.length < 3) {
        console.warn()('INFERJS-COMPILER',`Please specify an option. For help: <InferJSCompiler> -h or --help`);
        process.exit(0);
    }

    // Create a shorthand list
    const shortList = {
        f: { name: 'action', value: 'parse-files' },
        d: { name: 'action', value: 'parse-dir' },
        l: { name: 'action', value: 'parse-file-list' },
        p: 'preview', // TODO: Preview files to process
        s: 'stats', // TODO: Shows the stats
        v: 'version',
        q: 'quiet',
        h: 'help'
    };

    // Separate arguments
    const args = parseArgv(argv, shortList);

    if (args.hasOwnProperty('quiet')) {
        curr.verbose = false;
    }

    //console.(argv);

    try {

        // Declare variables
        let input, inputOptions, output, outputOptions, ic, results;

        // Check if version
        if (args.hasOwnProperty('version')) {

            console.log(info.version);
            process.exit();

        }

        // Check if help
        if (args.hasOwnProperty('help')) {

            let helpFile = (process.env.hasOwnProperty('LANGUAGE')) ? `help-${process.env['LANGUAGE']}.txt` : `help-en_us.txt`;
            let helpFilePath = path.normalize(path.resolve(`localization/${helpFile}`));

            const exists = await fileExists(helpFilePath);
            if (!exists) {
                helpFile = `help-en_us.txt`;
                helpFilePath = path.normalize(path.resolve(`localization/${helpFile}`));
            }

            results = await readFile(helpFilePath, 'utf8');

            if (results.err) throw (results.err);

            console.info()('INFERJS COMPILER HELP MENU')(`\n\n${results.data}`);
            process.exit(0);
        }

        if (!args.hasOwnProperty('action')) throw new Error(`Missing action command`);

        switch (args['action'].toLowerCase()) {

            // Parses a single js file
            case 'parse-files':

                if (args['input'].length === 0) throw new Error(`Missing required argument: <input> for parse-files`);

                input = args['input'];

                inputOptions = { encoding: 'utf8' };
                if (args.hasOwnProperty('input-options-encoding')) inputOptions['encoding'] = args['input-options-encoding'];

                outputOptions = { flag: "wx", module: "script" };
                if (args.hasOwnProperty('output-options-flag')) outputOptions['flag'] = args['output-options-flag'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];

                if (args['output'].length > 0) {

                    output = args['output'][0];

                }

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseFiles(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-files had internal error:\n${err.message}`);
                });

                break;

            // Parses a directory of file
            case 'parse-dir':

                if (!args.hasOwnProperty('input')) throw new Error(`Missing required argument: <input> for parse-dir`);

                input = args['input'];

                inputOptions = { encoding: 'utf8', recursive: false, allowedExtensions: ["js", "mjs"] };
                if (args.hasOwnProperty('input-options-recursive')) inputOptions['recursive'] = args['input-options-recursive'];
                if (args.hasOwnProperty('input-options-allowedExtensions')) inputOptions['allowedExtensions'] = args['input-options-allowedExtensions'];

                outputOptions = { flag: "wx", module: "script" };
                if (args.hasOwnProperty('output-options-flag')) outputOptions['flag'] = args['output-options-flag'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];

                if (args['output'].length > 0) {

                    output = args['output'][0];

                }

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseDirectories(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-dir had internal error:\n${err}`);
                });


                // if (!args.hasOwnProperty('input-dir')) throw new Error(`Missing required argument: <input-dir> for parse-dir`);

                // input = args['input-dir'];

                // inputOptions = { encoding: 'utf8', recursive: false, allowedExtensions: ["js", "mjs"] };
                // if (args.hasOwnProperty('input-dir-options-recursive')) inputOptions['recursive'] = args['input-dir-options-recursive'];
                // if (args.hasOwnProperty('input-dir-options-allowedExtensions')) inputOptions['allowedExtensions'] = args['input-dir-options-allowedExtensions'];

                // outputOptions = { flag: "wx", module: "script" };
                // if (args.hasOwnProperty('output-options-flag')) outputOptions['flag'] = args['output-options-flag'];
                // if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];

                // output = args['output-file'];
                // if (!output || typeof output !== 'string' || output.trim() === '') {

                //     // Output to input file directory
                //     output = path.dirname(input) + '/output.js';
                // }

                // // Get class
                // ic = new InferJSCompiler(args);

                // // Async Parse file 
                // results = await ic.parseDirectory(input, inputOptions, output, outputOptions).catch((err) => {
                //     throw new Error(`Processing action parse-dir had internal error:\n${err}`);
                // });

                break;

            // Parses a file list
            case 'parse-file-list':

                if (!args.hasOwnProperty('input-file-list')) throw new Error(`Missing required argument: <input-file-list> for parse-file-list`);

                // Parse List
                input = args['input-file-list'];

                inputOptions = { encoding: 'utf8' };
                if (args.hasOwnProperty('input-file-list-options-recursive')) inputOptions['recursive'] = args['input-file-list-options-recursive'];
                if (args.hasOwnProperty('input-file-list-options-allowedExtensions')) inputOptions['allowedExtensions'] = args['input-file-list-options-allowedExtensions'];

                outputOptions = { flag: "wx", module: "script" };
                if (args.hasOwnProperty('output-options-flag')) outputOptions['flag'] = args['output-options-flag'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];

                output = args['output-file'];
                if (!output || typeof output !== 'string' || output.trim() === '') {

                    // Output to input file directory
                    output = path.dirname(input) + '/output.js';
                }

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseFileList(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-list had internal error:\n${err}`);
                });

                break;

            // No action return command format
            default: throw new Error(`Did not recognize action: ${args['action']}`);
        }

    } catch (err) {

        // Write the error to the console.
        curr.verbose = true;
        console.error()('INFERJS-COMPILER',`${err.message}`);
        process.exitCode = 1;

    }
}

// Check if direct access or through class import
if (process && process.hasOwnProperty('argv') && typeof process.argv !== 'undefined') {

    // Call main
    main(process.argv);

}


