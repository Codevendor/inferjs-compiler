'use strict';

/**
 * Parses a command line into arguments.
 * @param {array} src - The command line to parse argv.
 * @param {object} shortHandList - The command short hand list.
 */
export function parseArgv(src, shortHandList = {}) {

    // Variables
    let outputFound = false;

    // Set fields
    const args = { input: [], output: [] };

    // Trim array strings first
    src = src.map(item => item.trim());

    // Set Globals
    args['$node-path'] = src.shift();
    args['$inferjs-compiler-path'] = src.shift();

    // Loop through all possible matches
    for (let i = 0; i < src.length; i++) {

        // Get argument
        const arg = src[i];

        if (arg.startsWith('--')) {

            // parse double --
            const pair = arg.split("=", 2).map(item => item.trim());

            if (!pair || pair.length === 0 || pair[0] === '$') continue;

            const option = pair[0].slice(2).toLowerCase();

            if (option === 'input') { continue; }

            if (pair.length === 2) {

                // Check if output file
                if (option === 'input' || option === 'input-file' || option === 'output' || option === 'output-file') {
                   
                    outputFound = true; 

                    // Check for quote strings
                    if (pair[1].startsWith('"') && pair[1].endsWith('"')) { args[option.split('-')[0]].push(pair[1].slice(1, -1)); continue; }
                    if (pair[1].startsWith("'") && pair[1].endsWith("'")) { args[option.split('-')[0]].push(pair[1].slice(1, -1)); continue; }
                    if (pair[1].startsWith('`') && pair[1].endsWith('`')) { args[option.split('-')[0]].push(pair[1].slice(1, -1)); continue; }

                    args[option.split('-')[0]].push(pair[1]);

                    continue;
                }

                // Check for quote strings
                if (pair[1].startsWith('"') && pair[1].endsWith('"')) { args[option] = pair[1].slice(1, -1); continue; }
                if (pair[1].startsWith("'") && pair[1].endsWith("'")) { args[option] = pair[1].slice(1, -1); continue; }
                if (pair[1].startsWith('`') && pair[1].endsWith('`')) { args[option] = pair[1].slice(1, -1); continue; }

                args[option] = pair[1];

            } else {

                // Skip because not set to anything
                if (option === 'input' || option === 'input-file' || option === 'output' || option === 'output-file') { outputFound = true; continue; }

                args[option] = true;
            }

        } else if (arg.startsWith('-')) {

            // parse double --
            const pair2 = arg.split("=", 2).map(item => item.trim());

            if (!pair2 || pair2.length === 0 || pair2[0] === '$') continue;

            const option2 = pair2[0].slice(1);

            if (option2.toLowerCase() === 'o') { outputFound = true; continue; }

            // Check for multi command
            if (pair2.length === 1) {

                // Split into single commands
                option2.split('').map(item => {

                    // Check if shorthand
                    if (shortHandList.hasOwnProperty(item)) {

                        // Get the short
                        const short = shortHandList[item];

                        if (typeof short === 'object' && short.hasOwnProperty('name') && short.hasOwnProperty('value')) {
                            args[short.name] = short.value;
                            return;
                        }

                        item = shortHandList[item];
                    }

                    // Just set command
                    args[item] = true;
                });

            } else {

                if (pair2.length === 2) {

                    // Check for quote strings
                    if (pair2[1].startsWith('"') && pair2[1].endsWith('"')) { args[name2] = pair2[1].slice(1, -1); continue; }
                    if (pair2[1].startsWith("'") && pair2[1].endsWith("'")) { args[name2] = pair2[1].slice(1, -1); continue; }
                    if (pair2[1].startsWith('`') && pair2[1].endsWith('`')) { args[name2] = pair2[1].slice(1, -1); continue; }
                    args[name2] = pair2[1];


                } else {
                    args[name2] = true;
                }
            }

        } else {

            // Jump if trying to overwrite global
            if (arg.startsWith('$')) continue;

            if (!outputFound) {

                // Add Input files
                if (arg.startsWith('"') && arg.endsWith('"')) { args['input'].push(arg.slice(1, -1)); continue; }
                if (arg.startsWith("'") && arg.endsWith("'")) { args['input'].push(arg.slice(1, -1)); continue; }
                if (arg.startsWith('`') && arg.endsWith('`')) { args['input'].push(arg.slice(1, -1)); continue; }
                args['input'].push(arg.trim());

            } else {

                // Add Output files
                if (arg.startsWith('"') && arg.endsWith('"')) { args['output'].push(arg.slice(1, -1)); continue; }
                if (arg.startsWith("'") && arg.endsWith("'")) { args['output'].push(arg.slice(1, -1)); continue; }
                if (arg.startsWith('`') && arg.endsWith('`')) { args['output'].push(arg.slice(1, -1)); continue; }
                args['output'].push(arg.trim());
            }

        }

    }

    return args;

}