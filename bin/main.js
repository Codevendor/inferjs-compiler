#! /usr/bin/env node

// Imports
import { curryConsole, COLOR, LABEL, ACTION } from "curry-console";
import { loadMeta, parseArgv, readFile, fileExists, jsonLoader } from "../src/helpers/helpers.js";
import { InferJSCompiler } from "../src/core/inferjs-compiler.js";
import path from "node:path";

// Load Meta
const meta = loadMeta(import.meta);
await jsonLoader(path.normalize(path.resolve(meta.__dirname, "../package.json")), 'info');

// curryConsole Settings
global.curr = new curryConsole();
curr.profile = true;
curr.verbose = true;
curr.defaultsLog = [];
curr.defaultsInfo = [LABEL.WHITE, LABEL.BG_BLUE, COLOR.BLUE];
curr.defaultsWarn = [LABEL.BLACK, LABEL.BG_YELLOW, COLOR.YELLOW];
curr.defaultsError = [LABEL.WHITE, LABEL.BG_RED, COLOR.RED];

/**
 * The main entry point into the CLI program.
 * @param {array} argv - The terminal parameters.
 */
export async function main(argv) {

    // Compiler requires more than 1 parameter
    if (argv.length < 3) {
        console.warn(ACTION.PROFILE(false))('INFERJS-COMPILER', `Please specify an option. For help: inferjs-compiler -h or --help`);
        process.exit(0);
    }

    // Create a shorthand list
    const shortList = {

        // Actions
        f: { name: 'action', value: 'parse-files' },
        d: { name: 'action', value: 'parse-directories' },
        l: { name: 'action', value: 'parse-file-list' },
        c: { name: 'action', value: 'combine' },

        // Options
        h: 'help',
        p: 'preview', // TODO: Preview files to process
        q: 'quiet',
        s: 'stats', // TODO: Shows the stats
        v: 'version',

    };

    // Separate arguments
    const args = parseArgv(argv, shortList);

    if (args.hasOwnProperty('quiet')) {
        curr.verbose = false;
    }

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

            let helpFile = (process.env.hasOwnProperty('LANGUAGE')) ? `help-${process.env['LANGUAGE'].toLowerCase()}.txt` : `help-en_us.txt`;
            let helpFilePath = path.normalize(path.resolve(meta.__dirname, `../localization/${helpFile}`));

            const exists = await fileExists(helpFilePath);
            if (!exists) {
                helpFile = `help-en_us.txt`;
                helpFilePath = path.normalize(path.resolve(meta.__dirname, `../localization/${helpFile}`));
            }

            results = await readFile(helpFilePath, { encoding: 'utf8' });

            if (results.err) throw (results.err);

            console.info(ACTION.PROFILE(false))('INFERJS COMPILER HELP MENU', `\n\n${results.data}`);
            process.exit(0);
        }

        if (!args.hasOwnProperty('action')) throw new Error(`Missing action command`);

        switch (args['action'].toLowerCase()) {

            // Parses a single js file
            case 'parse-files':

                if (args['input'].length === 0) throw new Error(`Missing required argument: <input> for parse-files`);

                input = args['input'];

                inputOptions = { flag: "r", encoding: "utf8" };
                if (args.hasOwnProperty('input-options-flags')) inputOptions['flag'] = args['input-options-flags'];
                if (args.hasOwnProperty('input-options-encoding')) inputOptions['encoding'] = args['input-options-encoding'];

                outputOptions = { flag: "wx", module: "script", env: "production" };
                if (args.hasOwnProperty('output-options-flags')) outputOptions['flag'] = args['output-options-flags'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];
                if (args.hasOwnProperty('output-options-env')) outputOptions['env'] = args['output-options-env'];

                output = (args['output'].length > 0) ? args['output'][0] : undefined;

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseFiles(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-files had internal error:\n${err.message}`);
                });

                break;

            // Parses a directory of file
            case 'parse-directories':

                if (!args.hasOwnProperty('input')) throw new Error(`Missing required argument: <input> for parse-directories`);

                input = args['input'];

                inputOptions = { flag: "r", encoding: 'utf8', recursive: false, fileExtensions: ["js", "mjs"] };
                if (args.hasOwnProperty('input-options-flags')) inputOptions['flag'] = args['input-options-flags'];
                if (args.hasOwnProperty('input-options-recursive')) inputOptions['recursive'] = args['input-options-recursive'];
                if (args.hasOwnProperty('input-options-file-extensions')) inputOptions['fileExtensions'] = args['input-options-file-extensions'];

                outputOptions = { flag: "wx", module: "script", env: "production" };
                if (args.hasOwnProperty('output-options-flags')) outputOptions['flag'] = args['output-options-flags'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];
                if (args.hasOwnProperty('output-options-env')) outputOptions['env'] = args['output-options-env'];

                output = (args['output'].length > 0) ? args['output'][0] : undefined;

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseDirectories(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-directories had internal error:\n${err}`);
                });

                break;

            // Parses a file list
            case 'parse-file-list':

                if (!args.hasOwnProperty('input')) throw new Error(`Missing required argument: <input> for parse-file-list`);

                // Parse List
                input = args['input'];

                inputOptions = { flag: "r", encoding: 'utf8', delimiter: "\n" };
                if (args.hasOwnProperty('input-options-flags')) inputOptions['flag'] = args['input-options-flags'];
                if (args.hasOwnProperty('input-options-recursive')) inputOptions['recursive'] = args['input-options-recursive'];
                if (args.hasOwnProperty('input-options-file-extensions')) inputOptions['fileExtensions'] = args['input-options-file-extensions'];
                if (args.hasOwnProperty('input-options-delimiter')) inputOptions['delimiter'] = args['input-options-delimiter'];

                outputOptions = { flag: "wx", module: "script", env: "production" };
                if (args.hasOwnProperty('output-options-flags')) outputOptions['flag'] = args['output-options-flags'];
                if (args.hasOwnProperty('output-options-module')) outputOptions['module'] = args['output-options-module'];
                if (args.hasOwnProperty('output-options-env')) outputOptions['env'] = args['output-options-env'];

                output = (args['output'].length > 0) ? args['output'][0] : undefined;

                // Get class
                ic = new InferJSCompiler(args);

                // Async Parse file 
                results = await ic.parseFileList(input, inputOptions, output, outputOptions).catch((err) => {
                    throw new Error(`Processing action parse-file-list had internal error:\n${err}`);
                });

                break;

            // No action return command format
            default: throw new Error(`Did not recognize action: ${args['action']}`);
        }

    } catch (err) {

        // Write the error to the console.
        curr.verbose = true;
        console.error()('INFERJS-COMPILER', `${err.message}`);
        process.exitCode = 1;

    }
}

// Check if direct access or through class import
if (process && process.hasOwnProperty('argv') && typeof process.argv !== 'undefined') {

    // Call main
    main(process.argv);

}


