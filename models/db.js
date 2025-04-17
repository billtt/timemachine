/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-2
 * Time: 下午3:59
 * To change this template use File | Settings | File Templates.
 */

const { MongoClient } = require('mongodb');
const settings = require('../settings');

let client;

async function open() {
    if (!client || !client.isConnected?.()) {
        client = await MongoClient.connect(settings.dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    return client.db(settings.dbName);
}

module.exports = { open };
