
const ProgressTracker = require("./ProgressTracker");
const PropertiesSingleton = require('../PropertiesSingleton');
const Helper = require('../helper/Helper');
const MongoStateCollectionTracker = require('../db/state/MongoStateCollectionTracker');
const MongoTransactionCollection = require('../db/MongoTransactionCollection');
class TransactionsExporterFromToAddressProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
        this.properties = PropertiesSingleton;
        this.helper = new Helper();
        this.mongoStateCollectionTracker = new MongoStateCollectionTracker();
        this.mongoTransactionCollection = new MongoTransactionCollection();
        this.objectsToProcess = [];

        this.completedAllTransactions = false;

        // Need to figure out how we can inscrease this number.
        // Currently this number has to be 1
        this.numberBlocksToProcessAtATime = 100;

        // We want to write to disk all transactions for a given block at the same time
        // To do this we are finding when we complete one block and go to the next block
        this.previousBlockBeingProcessed = null;
        this.currentBlockBeingProcessed = null;
    }

    shouldWriteToDisk() {
        let returnValue = false;

        // Make sure we have all the transactions for a given block before we write to disk
        if(this.previousBlockBeingProcessed != null &&
           this.previousBlockBeingProcessed != this.currentBlockBeingProcessed &&
           this.getListToExport().length > this.numberOfObjectsToWriteToDisk()) {
            
           returnValue = true;
        }
        return returnValue;
    }

    async getCurrentObject() {
        let transaction = null;

        await this.__blockUntillWeHaveMoreObjectToProcess();

        this.previousBlockBeingProcessed = this.currentBlockBeingProcessed;

        transaction = this.objectsToProcess.shift();

        this.currentBlockBeingProcessed = transaction.block_number;

        return transaction;
    }

    getParameterFromObject(transaction) {
        return transaction;
    }

    getMongoDbCollectionName() {
        return "fromTo";    
    }

    async updateTracker(blocksProcessed) {
        await this.mongoStateCollectionTracker.update(blocksProcessed);
    }

    async __blockUntillWeHaveMoreObjectToProcess() {
        while(this.objectsToProcess.length == 0) {

            this.objectsToProcess = 
                await this.mongoStateCollectionTracker.getNextTransactions(this.numberBlocksToProcessAtATime);
   
            if(this.objectsToProcess.length > 0) {
                break;
            } else {
                console.log('TransactionsExporterFromToAddressProgressTracker: Waiting for more blocks to process');
                this.helper.sleep(500);
            }
         }
    }

    getBatchSize() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().web3_batch_size;
    }

    numberOfObjectsToWriteToDisk() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().number_objects_to_write_to_disk_at_a_time;
    }
}

module.exports = TransactionsExporterFromToAddressProgressTracker;