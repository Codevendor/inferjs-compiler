#! /usr/bin/env node

// Imports
import { exec } from "node:child_process";
import * as readline from 'node:readline';

const name = process.env.npm_package_name;
const uname = process.env.npm_package_name.toUpperCase();
const version = process.env.npm_package_version;

console.log(`------------------------------------------------------------------`)
console.log(` Un-Install Script for ${name}@${version}`);
console.log(`------------------------------------------------------------------\n`)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`Would you like to un-install ${name}@${version}?\nType yes or no?: `, res => {
    
    if(res.toUpperCase().startsWith('Y')) {

        console.log(`\nUn-Installing ${name}@${version} ...\n`);
        rl.close();

    } else {

        process.exitCode = 1;
        process.exit();

    }

});