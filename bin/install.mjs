#! /usr/bin/env node

// Imports
import { logger } from "../src/core/logger.mjs";
import { exec } from "node:child_process";

// Create a logger
global.log = new logger(true, "\n");

const name = process.env.npm_package_name;
const uname = process.env.npm_package_name.toUpperCase();
const version = process.env.npm_package_version;

console.info()(uname)(`Install Script - Intialized for ${name}@${version} ...`);

console.info()(`GLOBAL`)(`Installing ${name}@${version} globally ...`);

exec(`npm install -g .`);

console.info()(uname)(`Install Complete`);