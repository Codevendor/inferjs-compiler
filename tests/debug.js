import { loadMeta, parseArgv, readFile, fileExists, jsonLoader } from "../src/helpers/helpers.js";
import path from "node:path";

const meta = loadMeta(import.meta);
await jsonLoader(path.normalize(path.resolve(meta.__dirname, "../package.json")), 'info');

// Imports
import { curryConsole, COLOR, LABEL, ACTION } from "curry-console";

// curryConsole Settings
global.curr = new curryConsole();
curr.profile = true;
curr.verbose = true;
curr.defaultsLog = [];
curr.defaultsInfo = [LABEL.WHITE, LABEL.BG_BLUE, COLOR.BLUE];
curr.defaultsWarn = [LABEL.BLACK, LABEL.BG_YELLOW, COLOR.YELLOW];
curr.defaultsError = [LABEL.WHITE, LABEL.BG_RED, COLOR.RED];


import { InferJSCompiler } from "../src/core/inferjs-compiler.js";

//const ic = new InferJSCompiler({preview: true});
const ic = new InferJSCompiler();
ic.parseFiles(['./tests/test-comments1.js', './tests/test-comments2.js'], { encoding: 'utf8' }, "./tests/inferobjects/test-comments2.io.js", { module: 'esm', env: 'd' });