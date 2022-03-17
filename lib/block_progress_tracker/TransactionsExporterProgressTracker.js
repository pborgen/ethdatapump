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
        return 'transaction';    
    }

    updateState() {
        //Get the Current block number we need to process if we do not have it already
        if (this.getCurrentBlockNumberToBeProcessed() == null) {
            this.setCurrentBlockNumberToBeProcessed(this.__getNextBlockToBeProcessed());
        }

        this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
    }

    shouldWriteToDisk() {
        let returnValue = false;

        // Make sure we have all the transactions for a given block before we write to disk
        if(this.getListToExport().length > this.numberOfObjectsToWriteToDisk()) {
           returnValue = true;
        }
        return returnValue;
    }

    isComplete() {
        let isComplete = false;
        let me = this;
        const isCompleteClosure = function() {      
            return me.getLastBlockProcessed() == me.__lastBlockNumberToBeProcessed;
        };

        // We want to process to keep running waiting 
        // for more work and wait motionless untill there is more work to do
        while (isCompleteClosure()) {
            this.helper.sleep(100000);
            isComplete = isCompleteClosure();
        }
        return  isComplete;
    }

    async getCurrentObject() {
        if (this.getCurrentBlockNumberToBeProcessed() == null) {
            this.setCurrentBlockNumberToBeProcessed(await this.__getNextBlockToBeProcessed());
        }

        let returnValue = this.getCurrentBlockNumberToBeProcessed();

        if ((this.__lastBlockNumberToBeProcessed - returnValue) < 100000) {
            this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
        }

        this.setCurrentBlockNumberToBeProcessed(returnValue);

        return returnValue;
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

    async __getNextBlockToBeProcessed() {
        
        const lastBlockToBeProcessed = 
            await this.mongoTransactionCollection.getLargestBlockNumber();

        return lastBlockToBeProcessed + 1;
    }
}

module.exports = TransactionsExporterProgressTracker;