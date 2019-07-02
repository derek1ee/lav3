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

const { ServiceBusClient } = require("@azure/service-bus");

const sbClients = new Map();

module.exports = async function (context) {
    const params = context.bindings.params;
    var sbClient;

    if (sbClients.has(params.conn)) {
        sbClient = sbClients.get(params.conn);
    } else {
        sbClient = ServiceBusClient.createFromConnectionString('Endpoint=sb://deli-servicebus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=3OqxtXymdKqfzp/BzadIEYMq2jhASn0wm6wzgPr3Ptg=');
        sbClients.set(params.conn, sbClient);
    }

    const queueClient = sbClient.createQueueClient(params.queue);
    const sender = queueClient.createSender();

    try {
        await sender.send({"body": params.message});
    
        await queueClient.close();
      } finally {
        // await sbClient.close();
        // setTimeout(function() {
        //     sbClient.close();
        //     sbClients.delete(params.conn);
        // }, 10000);
      }

    return `Sent`;
};