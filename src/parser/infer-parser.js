/**
 * Test 1 case scenario for JavaScript inferjs function.
 * @category     tests
 * @function foo
 * @param {string} msg - The message to send through console.log().
 * @param {(number|string)} id - The id of the message.
 * @param {boolean} send - Whether to send your message.
 * @infer {string} msg {STRING-NOT-EMPTY} - Checks if string is not empty.
 * @infer {(number|string)} id {INT8} - Check if number.
 * @inferid foo
 * @return1 {(InferTypeError|InferExpectError|string)} - Returns an error or the msg.
 * @return       {(InferTypeError|InferExpectError|string)}
 */

export class inferParser {

    // Public fields
    idx = 0;
    buf = '';
    len = 0;
    obj = {};

    /** The constructor for the inferParser. */
    constructor(text) {

        // Assign buffer
        if (typeof text !== 'undefined') {
            this.buf = text;
            this.len = text.length;
        }

    }

    /** Reset the parser. */
    reset() {

        this.idx = 0;
        this.buf = '';
        this.len = 0;

    }

    #eatAsterisk() {
        if (this.buf[this.idx] !== '*') {
            throw new Error('Expected "*"');
        }
        this.idx++;
    }

    #eatComma() {
        if (this.buf[this.idx] !== ',') {
            throw new Error('Expected ",".');
        }
        this.idx++;
    }

    /** Eats a specific character. */
    #eatChar(char) {

        if (this.buf[this.idx] !== char) {
            throw new Error(`Expected '${char}'`);
        }
        this.idx++;

    }





    #showCurrent() {
        console.log('Current: ' + this.buf.substring(this.idx, this.idx + 10));
    }


    parse(text) {

        // Comment Start
        const commentStart = () => {

            this.idx = this.buf.indexOf("/**", this.idx);
            this.idx += 3;

        }

        // Comment End
        const commentEnd = () => {

            this.idx = this.buf.indexOf("*/", this.idx);
            this.idx += 2;

        };

        // Assign buffer
        if (typeof text !== 'undefined') {
            this.buf = text;
            this.len = text.length;
        }

    }






    parse2(text) {

        // Assign buffer
        if (typeof text !== 'undefined') {
            this.buf = text;
            this.len = text.length;
        }

        for (let i = this.idx; i < this.len; i++) {

            // Jump to open
            commentOpen();

            // Skip
            //this.#skipSpace();
            skipSpace();

            //this.#showCurrent();

            // Remove asterisk
            //this.#eatAsterisk();



            // Parse Tag
            this.#parseTags();

            //this.#showCurrent();

            //console.log(this.#idx, this.#buf[this.#idx]);

            return;

        }

    }

    #parseTags() {

        // Skip
        skipSpace();

        // Peek the char
        switch (peek()) {

            // Check for end;
            case '/':

                if (this.buf[this.len - 1] === '*') return;
                this.idx++;
                this.#parseTags();
                break;

            // Parameter check
            case '@':

                // Get tag
                const tag = getTag();

                break;

            // Description
            default:

                parseDesc();

                // Get description
                this.idx++;
                this.#parseTags();
                break;
        }

    }

}