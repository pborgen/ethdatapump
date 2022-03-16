

const PropertiesSingleton = require('../../PropertiesSingleton');
const Mongo = require('../Mongo');
const Helper = require('../../helper/Helper');

// Replace the uri string with your MongoDB deployment's connection string.


class MongoStateCollection  {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.mongo = new Mongo();
        this.helper = new Helper();
        
    }

    async createTrackerCollection() {
        const collectionName = "tracker";

        const doestrackerCollectionExists = 
            await this.mongo.doesCollectionExistsWithName(collectionName, "state");
        // If the collect exist dont create it
        if (doestrackerCollectionExists) {
            return;
        }

        const closureCreateFromToCollection = async function(db) {
            
            const collectionOptions = {
                capped: false,
            };

            await db.createCollection(collectionName, collectionOptions);     
        };

        await this.mongo.execute(closureCreateFromToCollection, "state");
    }

    async populateTrackerCollection() {
        const closureInsert = async function(db) {
            const ethGeneric = db.collection("tracker");
            const options = { ordered: false };
            const elements = [{
                name: "tracker_transactions",
                status: "avaiable",
                lastBlockProcessed: 10000000,
                blocksCurrentlyBeingProcessed: []
            }];
            const returnValue = await ethGeneric.insertMany(elements, options);

            return returnValue;
        };

        const insertMessage = await this.mongo.execute(closureInsert, "state");

        console.log('Populate the tracker collection ' + insertMessage);

        return insertMessage;
    }

    
}

module.exports = MongoStateCollection;