// Imports
import test from "node:test";
import { main } from "../bin/main.js";

/*
import { InferJSCompiler } from "../src/core/inferjs-compiler.js";

export async function testParseFile() {

    const input = `./test-comments1.js`;

    const inputOptions = { };

    const output = './inferobjects/test-comments1.io.js';

    const outputOptions = { module: 'esm'};

    // Get class
    const ic = new InferJSCompiler();

    // Async Parse file 
    results = await ic.parseFile(input, inputOptions, output, outputOptions).catch((err) => {
        throw new Error(`Processing action parse-file had internal error: ${err}`);
    });

}
*/

export async function testParseFile() {

    main();
    
}

if (process.argv?.[1].endsWith('test-parse-file.js')) {
    
    test('Parse File', async(t) => {
        await testParseFile();
    });

}


