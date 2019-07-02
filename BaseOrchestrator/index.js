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
    const outputs = new Map();
    
    outputs.set("Echo", yield context.df.callActivity("Echo", "http://www.google.com"));

    yield context.df.callActivity("Echo", "http://www.google.com");

    outputs.set("Send Message", yield context.df.callActivity("ServiceBus", {"queue": "testqueue", "message": "lorem ipsum"}));

    yield context.df.callActivity("ServiceBus", {"queue": "testqueue", "message": "lorem ipsum"});

    yield context.df.callActivity("ServiceBus2", {"conn": "myConn", "queue": "testqueue", "message": "lorem ipsum"});

    var a = [ ...Array(10).keys() ];

    yield context.df.callSubOrchestrator("ForEachOrchestrator", {"items": a,
                                                                 "activity": "ServiceBus2"});

    // Here I'm consuming the output from a previous action
    outputs.set("Call HTTP", yield context.df.callActivity("HTTP", {"uri": outputs.get("Echo"),
                                                                    "method": "GET"}));

    outputs.set("Call HTTP", yield context.df.callActivity("CosmosDB", {"database": "db",
                                                                        "container": "test",
                                                                        "item": {"id": "AnswerToEverything",
                                                                                 "value": 42}}));

    const parallelTasks = [];
    parallelTasks.push(context.df.callActivity("Echo", "Microsoft"));
    parallelTasks.push(context.df.callActivity("Echo", "Azure"));
    yield context.df.Task.all(parallelTasks);

    var a = [ ...Array(1000).keys() ];

    yield context.df.callSubOrchestrator("ForEachOrchestrator", {"items": a,
                                                                 "activity": "CosmosDB"});

    return outputs;
});