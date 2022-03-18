const ProgressTracker = require("./ProgressTracker");
const Web3Helper = require("../helper/Web3Helper");
const Helper = require('../helper/Helper');
const PropertiesSingleton = require('../PropertiesSingleton');
const MongoTransactionCollection = require('../db/MongoTransactionCollection');
class TransactionsExporterProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
        this.web3Helper = new Web3Helper();
        this.mongoTransactionCollection = new MongoTransactionCollection();
        this.helper = new Helper();
        this.properties = PropertiesSingleton;
        this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
    }

    getMongoDbCollectionName() {
        return "transaction";    
    }

    shouldWriteToDisk() {
        let returnValue = false;

        // Make sure we have all the transactions for a given block before we write to disk
        if(this.getListToExport().length > this.numberOfObjectsToWriteToDisk()) {
           returnValue = true;
        }
        return returnValue;
    }

    async getCurrentObject() {
        if (this.getCurrentBlockNumberToBeProcessed() == null) {
            const firstBlockToStartProcessingFrom = await this.__getFirstBlockToStartProcessingFrom();
            console.log("Starting at block " + firstBlockToStartProcessingFrom);
            this.setCurrentBlockNumberToBeProcessed(firstBlockToStartProcessingFrom);
        } else {
            this.setCurrentBlockNumberToBeProcessed(this.getCurrentBlockNumberToBeProcessed() + 1);
        }

        let currentBlockNumberToBeProcessed = this.getCurrentBlockNumberToBeProcessed();

        const shouldUpdateLastKnownBlock = 
            this.__lastBlockNumberToBeProcessed == currentBlockNumberToBeProcessed;

        while (shouldUpdateLastKnownBlock) {
            console.log('TransactionsExporterProgressTracker: Waiting for more blocks to process');
            this.helper.sleep(500);

            this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
        }

        return currentBlockNumberToBeProcessed;
    }

    getParameterFromObject(blockNumber) {
        return blockNumber;
    }
    
    getBatchSize() {
        return this.properties.getExportTransactionsPerformanceConfiguration().web3_batch_size;
    }

    numberOfObjectsToWriteToDisk() {
        return this.properties.getExportTransactionsPerformanceConfiguration().number_objects_to_write_to_disk_at_a_time;
    }

    async __getFirstBlockToStartProcessingFrom() {
        
        const lastBlockToBeProcessed = 
            await this.mongoTransactionCollection.getLargestBlockNumber();

        return lastBlockToBeProcessed + 1;
    }

    async updateTracker(blocksProcessed) {
       return;
    }
}

module.exports = TransactionsExporterProgressTracker;