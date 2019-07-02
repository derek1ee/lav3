/*
 * This function is not intended to be invoked directly. Instead it will be
 * triggered by an HTTP starter function.
 * 
 * Before running this sample, please:
 * - create a Durable activity function (default name is "Hello")
 * - create a Durable HTTP starter function
 * - run 'npm install durable-functions' from the wwwroot folder of your 
 *    function app in Kudu
 */

const df = require("durable-functions");

module.exports = df.orchestrator(function* (context) {
    const inputs = context.df.getInput();
    
    const tasks = [];

    for (const item in inputs.items) {
        // tasks.push(context.df.callActivity(inputs.activity, {"database": "db",
        //                                                                  "container": "test",
        //                                                                  "item": {"id": item,
        //                                                                           "value": item}}));
        tasks.push(context.df.callActivity(inputs.activity, {"conn": "myConn", "queue": "testqueue", "message": "lorem ipsum"}));
    }

    yield context.df.Task.all(tasks);
});