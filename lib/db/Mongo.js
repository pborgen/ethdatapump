

const PropertiesSingleton = require('../PropertiesSingleton');
const { MongoClient } = require('mongodb')
const CSVReader = require('../helper/CsvReader');

// Replace the uri string with your MongoDB deployment's connection string.


class Mongo {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.cSVReader = new CSVReader();
        this.uri = this.properties.getMongoDB().uri;
        this.dbName = this.properties.getMongoDB().dbName;
    }

    getCollections() {
        return db.getCollectionNames();
    }

    async __insert(closure) {
        const client = new MongoClient(this.uri);

        try {
            // Connect to the MongoDB cluster
            await client.connect();
            
            const db = client.db(this.dbName);

            // Make the appropriate DB calls
            const returnValue = await closure(db);
            
            return returnValue;

        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }

    async insertCsv(fullpathCsvFile, csvFileHeadersInOrder, collectionName) {

        const csv_elements = this.cSVReader.read(fullpathCsvFile, csvFileHeadersInOrder);

        const closure = async function(db) {
            const ethGeneric = db.collection(collectionName);

            const options = { ordered: false };
      
            const returnValue = await ethGeneric.insertMany(csv_elements, options);

            return returnValue;
        };

        const insertMessage = await this.__insert(closure);

        console.log('insertMessage: ' + insertMessage);
        
    }
}

module.exports = Mongo;