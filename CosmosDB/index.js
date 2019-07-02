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

const CosmosClient = require('@azure/cosmos').CosmosClient;

module.exports = async function (context) {
    const params = context.bindings.params;

    const endpoint = "https://deli.documents.azure.com:443/";
    const masterKey = "DAGFZkq8jPtOqELK17OVXRvMfg4jGOjAeNFmixXgrVpstWslq9FxgLjBGUZdEn8HeOpYjXGSyNzEyDzvN267fQ==";

    const client = new CosmosClient({ endpoint: endpoint, auth: { masterKey: masterKey } });

    await client.database(params.database).container(params.container).items.upsert(params.item);

    return `Hello ${context.bindings.name}!`;


};