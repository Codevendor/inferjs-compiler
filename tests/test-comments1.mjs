/**
 * Test 1 case scenario for JavaScript inferjs function.
 * @category tests
 * @function foo
 * @param {string} msg - The message to send through console.log().
 * @param {(number|string)} id - The id of the message.
 * @param {boolean} send - Whether to send your message.
 * @infer {string} msg {STRING-NOT-EMPTY} - Checks if string is not empty.
 * @infer {(number|string)} id {INT8} - Check if number.
 * @inferid foo
 * @return {(InferTypeError|InferExpectError|string)} - Returns an error or the msg.
 */
