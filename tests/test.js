// Imports
import test from "node:test";
import { testParseDir } from "./test-parse-dir.js";
import { testParseFile } from "./test-parse-file.js";
import { testParseFileList } from "./test-parse-file-list.js";
import { testParseList } from "./test-parse-list.js";

if (process.argv?.[1].endsWith('test.js')) {

    test('Parse File', async (t) => {
        await testParseFile();
    });

    test('Parse Directory', async (t) => {
        await testParseDir();
    });

    test('Parse File List', async (t) => {
        await testParseFileList();
    });

    test('Parse List', async (t) => {
        await testParseList();
    });

}