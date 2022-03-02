

const PropertiesSingleton = require('../PropertiesSingleton');
const Mongo = require('./Mongo');
const MongoStateCollection = require('./state/MongoStateCollection');
// Replace the uri string with your MongoDB deployment's connection string.


class MongoSetup {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.mongo = new Mongo();
        this.mongoStateCollection = new MongoStateCollection();
    }

    async setup() {
        await this.mongo.createTransactionCollection();
        await this.mongo.createFromToCollection();
        await this.mongoStateCollection.createTrackerCollection();
        await this.mongoStateCollection.populateTrackerCollection();
    }
}

module.exports = MongoSetup;