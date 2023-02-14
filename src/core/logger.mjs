'use strict';

import { type_of } from "../helpers/type-of.mjs";

/**
 * For creating a colorObject.
 */
class colorObject {

    #color = '';

    get name() { return this.constructor.name; }

    constructor(color) { this.#color = color; }

    toString() {
        return this.#color;
    }
}

/**
 * Custom color objects.
 */
export const COLOR = {

    BLACK: new colorObject("\x1b[30m"),
    RED: new colorObject("\x1b[31m"),
    GREEN: new colorObject("\x1b[32m"),
    YELLOW: new colorObject("\x1b[33m"),
    BLUE: new colorObject("\x1b[34m"),
    MAGENTA: new colorObject("\x1b[35m"),
    CYAN: new colorObject("\x1b[36m"),
    WHITE: new colorObject("\x1b[37m"),

    DEFAULT: new colorObject(''),
    RESET: new colorObject("\x1b[0m"),
    BRIGHT: new colorObject("\x1b[1m"),
    DIM: new colorObject("\x1b[2m"),
    UNDERCORE: new colorObject("\x1b[4m"),
    BLINK: new colorObject("\x1b[5m"),
    REVERSE: new colorObject("\x1b[7m"),
    HIDDEN: new colorObject("\x1b[8m"),

    FG_BLACK: new colorObject("\x1b[30m"),
    FG_RED: new colorObject("\x1b[31m"),
    FG_GREEN: new colorObject("\x1b[32m"),
    FG_YELLOW: new colorObject("\x1b[33m"),
    FG_BLUE: new colorObject("\x1b[34m"),
    FG_MAGENTA: new colorObject("\x1b[35m"),
    FG_CYAN: new colorObject("\x1b[36m"),
    FG_WHITE: new colorObject("\x1b[37m"),

    BG_BLACK: new colorObject("\x1b[40m"),
    BG_RED: new colorObject("\x1b[41m"),
    BG_GREEN: new colorObject("\x1b[42m"),
    BG_YELLOW: new colorObject("\x1b[43m"),
    BG_BLUE: new colorObject("\x1b[44m"),
    BG_MAGENTA: new colorObject("\x1b[45m"),
    BG_CYAN: new colorObject("\x1b[46m"),
    BG_WHITE: new colorObject("\x1b[47m")
};

/**
 * Creates a custom colored terminal logger.
 */
export class logger {

    #session = [];
    #verbose = false;
    #format = false;

    #utcPrev = 0;

    #oldInfo = null;
    #oldLog = null;
    #oldWarn = null;
    #oldError = null;
    #oldTrace = null;
    #oldDebug = null;

    /** Returns the session. */
    get session() { return this.#session; }

    get verbose() { return this.#verbose; }
    set verbose(value) { this.#verbose = value; }

    constructor(verbose = true, format = '') {

        this.#session = [];
        this.#verbose = verbose;
        this.#format = format;

        // Backup original methods
        this.#oldLog = console.log;
        this.#oldInfo = console.info;
        this.#oldWarn = console.warn;
        this.#oldError = console.error;
        this.#oldTrace = console.trace;
        this.#oldDebug = console.debug;

        // Attach new events
        console.log = this.#log.bind(this);
        console.info = this.#info.bind(this);
        console.warn = this.#warn.bind(this);
        console.error = this.#error.bind(this);
        console.trace = this.#trace.bind(this);
        console.debug = this.#debug.bind(this);

        const self = this;

        // Log Curry
        console.log = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (...y) => {
                    self.#log(x, y);
                }

            }

            self.#oldLog(...x);

        };

        // Log info
        console.info = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (y) => {
                    return (...z) => {
                        self.#info(x, y, z);
                    }
                }
            }

            self.#oldInfo(...x);

        };

        // Log warn
        console.warn = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (y) => {
                    return (...z) => {
                        self.#warn(x, y, z);
                    }
                }
            }

            self.#oldWarn(...x);

        };

        // Log error
        console.error = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (y) => {
                    return (...z) => {
                        self.#error(x, y, z);
                    }
                }
            }

            self.#oldError(...x);

        };

        // Log trace
        console.trace = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (y) => {
                    return (...z) => {
                        self.#trace(x, y, z);
                    }
                }
            }

            self.#oldTrace(...x);

        };

        // Log debug
        console.debug = (...x) => {

            if (x.length > 0 && type_of(x[0], true) === 'colorObject') {
                return (y) => {
                    return (...z) => {
                        self.#debug(x, y, z);
                    }
                }
            }

            self.#oldDebug(...x);

        };

    }

    /** Resets the session. */
    reset() {
        this.#session = [];
    }

    /**
     * Calculates the milliseconds into shorthand string.
     * @param {number} ms - The milliseconds to caculate into shorthand string.
     * @returns {string} - The shorthand string.
     */
    #calculate_time(ms) {

        // Check types
        //const ms_type = helpers.expect(this.#calculate_time, 1, ms, ['number']);

        let ms2 = ((ms % 1000) / 100).toString().split('.');
        ms2 = (ms2.length > 1) ? ms2[1] : ms2[0];
        const secs = Math.floor((ms / 1000) % 60);

        return `+${secs}.${ms2}ms`;

    }

    /**
     * Adds a profiler object to show how long between console.log messages.
     * @param {string} logType - The log type.
     * @param {array} colors - The colors as an array. 
     * @param {string} label - The label or color. 
     * @param {*} args - The arguments to send through to spread parameters.
     * @returns {object} - An object with profiler information.
     */
    #profiler(logType, colors, label, args) {

        const obj = {};

        // Create date
        obj.utc = new Date();

        // Set args
        obj.logType = logType;
        obj.label = label;
        obj.colors = colors;

        obj.args = args;

        // Calculate previous date
        const curr = Number(obj.utc);
        obj.diff = curr - this.#utcPrev;

        // Store new utc
        this.#utcPrev = curr;

        return obj;

    }

    /**
     * Writes the message to terminal.
     * @param {*} method 
     * @param {*} obj 
     * @param {*} message 
     */
    #write(method, obj, ...message) {

        // Add to session
        this.#session.push({ method: method.name, message: message });

        // Check if quiet mode
        if (!this.#verbose) return;

        // Call internal method to display message.
        method(...message);
        if (this.#format) method(this.#format);
    }

    /**
     * Displays the message to the console.
     * @param {*} method - The method called.
     * @param {*} obj - The object for writing.
     */
    #display(method, obj) {

        if (!this.#verbose) return;

        const diff = this.#calculate_time(obj.diff);

        switch (method.name) {

            case 'info':

                if (obj.colors.length === 1 && obj.colors[0].toString() === '') {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_CYAN + COLOR.FG_BLACK + ' ' + obj['label'] + ' ' + COLOR.RESET + COLOR.FG_CYAN, ...obj.args, COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                } else {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_CYAN + COLOR.FG_BLACK + ' ' + obj['label'] + ' ' + COLOR.RESET + obj.colors.join(''), ...obj.args, COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                }

                break;

            case 'warn':

                this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_YELLOW + COLOR.FG_BLACK + ' ' + obj['label'] + ' ' + COLOR.RESET + COLOR.FG_YELLOW, ...obj.args, COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                break;

            case 'error':

                if (obj.colors.length === 1 && obj.colors[0].toString() === '') {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_RED + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + COLOR.FG_RED, ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                } else {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_RED + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + obj.colors.join(''), ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                }

                break;

            case 'trace':

                if (obj.colors.length === 1 && obj.colors[0].toString() === '') {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_RED + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + COLOR.FG_RED, ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                } else {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_RED + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + obj.colors.join(''), ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                }

                break;

            case 'debug':

                if (obj.colors.length === 1 && obj.colors[0].toString() === '') {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_MAGENTA + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + COLOR.FG_MAGENTA, ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                } else {
                    this.#write(method, obj, ' ' + COLOR.RESET + COLOR.BG_MAGENTA + COLOR.FG_WHITE + ' ' + obj['label'] + ' ' + COLOR.RESET + obj.colors.join(''), ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                }

                break;

            case 'log':

                if (obj.colors.length === 1 && obj.colors[0].toString() === '') {
                    this.#write(method, obj, COLOR.RESET + COLOR.FG_BLUE, ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                } else {
                    this.#write(method, obj, COLOR.RESET + obj.colors.join(''), ...obj.args, COLOR.RESET + COLOR.DIM + COLOR.FG_WHITE + diff + COLOR.RESET);
                }

                break;

            default:

                this.#write(method, obj, ...obj.args);
                break;

        }

    }

    /** Writes log to console if verbose is true. */
    #log(colors, args) {
        const obj = this.#profiler('log', colors, '', args);
        this.#display(this.#oldLog, obj);
    }

    /** Writes info to console if verbose is true. */
    #info(colors, label, args) {
        const obj = this.#profiler('info', colors, label, args);
        this.#display(this.#oldInfo, obj);
    }

    /** Writes warn to console if verbose is true. */
    #warn(colors, label, args) {
        const obj = this.#profiler('warn', colors, label, args);
        this.#display(this.#oldWarn, obj);
    }

    /** Writes error to console if verbose is true. */
    #error(colors, label, args) {
        const obj = this.#profiler('error', colors, label, args);
        this.#display(this.#oldError, obj);
    }

    /** Writes error to console if verbose is true. */
    #debug(colors, label, args) {
        const obj = this.#profiler('debug', colors, label, args);
        this.#display(this.#oldDebug, obj);
    }

    /** Writes trace to console if verbose is true. */
    #trace(colors, label, args) {
        const obj = this.#profiler('trace', colors, label, args);
        this.#display(this.#oldTrace, obj);
    }

}