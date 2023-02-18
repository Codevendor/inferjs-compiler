#! /usr/bin/env node

// Imports
import { logger, COLOR } from "../src/core/logger.js";
import { exec } from "node:child_process";

// Create a logger
global.log = new logger(true, "\n");

const name = process.env.npm_package_name;
const uname = process.env.npm_package_name.toUpperCase();
const version = process.env.npm_package_version;

console.info(COLOR.DEFAULT)(uname)(`Install Script - Intialized for ${name}@${version} ...`);

console.info(COLOR.DEFAULT)(`GLOBAL`)(`Installing ${name}@${version} globally ...`);

exec(`npm install -g .`);

console.info(COLOR.DEFAULT)(uname)(`Install Complete`);

console.log(COLOR.GREEN)('Testing');