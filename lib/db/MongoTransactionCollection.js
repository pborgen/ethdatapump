

const PropertiesSingleton = require('../PropertiesSingleton');
const { MongoClient } = require('mongodb')
const Mongo = require('./Mongo');

// Replace the uri string with your MongoDB deployment's connection string.


class MongoTransactionCollection {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.mongo = new Mongo();
    }

    async doesBlockExist(blockNumber) {
        const closure = async function(db) {
            const collection = db.collection("transaction");
            
            let value = 
                await collection
                    .countDocuments({"block_number": blockNumber}) > 0

            return value;
        };

        return await this.mongo.execute(closure, "eth");
    }

    async getTransactions(blockNumbers) {
        const closure = async function(db) {
            const collection = db.collection("transaction");
            
            let value = 
                await collection
                    .find({"block_number": { $in: blockNumbers }})
                    .sort({"block_number": 1 })
                    .toArray()

            return value;
        };

        return await this.mongo.execute(closure, "eth");
    }

    async getLargestBlockNumber() {
        const closure = async function(db) {
            const collection = db.collection("transaction");
            const value = 
            await collection
                    .find()
                    .sort({"block_number": -1})
                    .limit(1)
                    .toArray();

            
            return value[0].block_number;
        };

        return await this.mongo.execute(closure, "eth");
    }

    async getSmallestBlockNumber() {
        const closure = async function(db) {
            const collection = db.collection("transaction");
            const value = 
            await collection
                    .find()
                    .sort({"block_number": 1})
                    .limit(1)
                    .toArray();

            
            return value[0].block_number;
        };

        return await this.mongo.execute(closure, "eth");

    }
}

module.exports = MongoTransactionCollection;