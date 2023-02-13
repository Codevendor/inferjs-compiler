#! /usr/bin/env node

// Imports
import { logger } from "../src/core/logger.mjs";
import { exec } from "node:child_process";

// Create a logger
global.log = new logger(true, "\n");

const name = process.env.npm_package_name;
const uname = process.env.npm_package_name.toUpperCase();
const version = process.env.npm_package_version;

console.info()(uname)(`Uninstall Script - Intialized for ${name}@${version} ...`);

console.info()('GLOBAL')(`Removing ${name}@${version} globally ...`);

exec(`npm uninstall -g ${name}`);

console.info()(uname)(`Uninstall Complete`);