#! /usr/bin/env node

// Imports
import { execSync } from "node:child_process";
import * as readline from 'node:readline';

const name = process.env.npm_package_name;
const uname = process.env.npm_package_name.toUpperCase();
const version = process.env.npm_package_version;

console.log(`------------------------------------------------------------------`)
console.log(` Install Script for ${name}@${version}`);
console.log(`------------------------------------------------------------------\n`)

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', res => {
    
    if(res.toUpperCase().startsWith('Y')) {

        console.log(`\nInstalling ${name}@${version} ...\n`);

        rl.close();

    } else {

        console.log(`\nNot Installed... Exiting\n`);

        process.exitCode = 1;
        process.exit();

    }

});

rl.setPrompt(`Would you like to install ${name}@${version}\nType yes or no?: `);
rl.prompt();