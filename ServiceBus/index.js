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

module.exports = async function (context) {
    const params = context.bindings.params;

    const sbClient = ServiceBusClient.createFromConnectionString('Endpoint=sb://deli-servicebus.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=3OqxtXymdKqfzp/BzadIEYMq2jhASn0wm6wzgPr3Ptg=');
    const queueClient = sbClient.createQueueClient(params.queue);
    const sender = queueClient.createSender();

    try {
        await sender.send({"body": params.message});
    
        await queueClient.close();
      } finally {
        await sbClient.close();
      }

    return `Sent`;
};