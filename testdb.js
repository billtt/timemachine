const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

MongoClient.connect(uri, function (err, client) {
    if (err) return console.error('Connection error:', err);
    console.log('Connected!');
    client.close();
});