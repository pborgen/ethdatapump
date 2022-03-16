

const PropertiesSingleton = require('../PropertiesSingleton');
const { MongoClient } = require('mongodb')


class Mongo {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.uri = this.properties.getMongoDB().uri;

    }

     async getCollections(dbName) {
        
        const closureGetCollections = async function(db) {
            const collections = await db.listCollections();

            return collections.toArray();
        };

        return await this.execute(closureGetCollections, dbName);
    }

    async doesCollectionExistsWithName(name, dbName) {
        let names = [];
        const collections = await this.getCollections(dbName);

        for (let collection of collections) {
            names.push(collection.name);
        }
        let collectionExists = names.includes(name); 
        return collectionExists;  
    }

    async execute(closureExecute, dbName=null) {
        const client = new MongoClient(this.uri);
        let returnValue = null;
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            
            const db = client.db(dbName);

            returnValue = await closureExecute(db);
        } catch (e) {
            console.error(e);
            returnValue = "There was a error";
        } finally {
            await client.close();
        }

        return returnValue;
    }

    async createTransactionCollection() {
        const collectionName = "transaction";
        const dbName = "eth";

        // If the collect exist dont create it
        if (await this.doesCollectionExistsWithName(collectionName, 'eth')) {
            return;
        }

        const closureCreateTransactionCollection = async function(db) {
            
            const collectionOptions = {
                capped: false,
            };
 
            await db.createCollection(collectionName, collectionOptions);


            const collection = db.collection(collectionName);

            return await collection.createIndex("transaction_block_number_idx", { block_number: 1 });
        };

        await this.execute(closureCreateTransactionCollection, dbName);
    }



    async createFromToCollection() {
        const collectionName = "fromTo";
        const dbName = "eth";

        // If the collect exist dont create it
        if (await this.doesCollectionExistsWithName(collectionName)) {
            return;
        }

        const closureCreateFromToCollection = async function(db) {
            
            const collectionOptions = {
                capped: false,
            };

            await db.createCollection(collectionName, collectionOptions);     
            
            const indexOptions = {
                unique: true,
                name: "fromToIndex"
            }
        };

        await this.execute(closureCreateFromToCollection, dbName);
    }

    async insert(elements, dbName, collectionName) {

        const closureInsert = async function(db) {
            const ethGeneric = db.collection(collectionName);
            const options = { ordered: false };
      
            let returnValue;
            try {
                returnValue = await ethGeneric.insertMany(elements, options);
            } catch(e) {
                console.error("Error inserting into " + collectionName + " Error:" + e);
                await db.collection(collectionName + "Errors").insertMany(elements, options);
            }
            return returnValue;
        };

        const insertMessage = await this.execute(closureInsert, dbName);

        console.log('insertMessage: ' + insertMessage);

        return insertMessage;
    }



    async insertCsv(fullpathCsvFile, csvFileHeadersInOrder, collectionName) {

        const elements = this.cSVReader.read(fullpathCsvFile, csvFileHeadersInOrder);

        await this.__insert(elements, collectionName);
        
    }



}

module.exports = Mongo;