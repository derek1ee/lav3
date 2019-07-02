/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an orchestrator function.
 * 
 * Before running this sample, please:
 * - create a Durable orchestration function
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your
 *   function app in Kudu
 */

const rpn = require('request-promise-native');

module.exports = async function (context) {
    const params = context.bindings.params;

    const response = await rpn(params.uri);

    return response;

    //return `Hello ${context.bindings.name}!`;
};