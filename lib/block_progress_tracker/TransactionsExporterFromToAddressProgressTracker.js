
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
        this.getTransactions
        this.objectsToProcess = null;
        this.hasState = false;
        this.completedAllTransactions = false;

        // Need to figure out how we can inscrease this number.
        // Currently this number has to be 1
        this.numberBlocksToProcessAtATime = 1;
    }


    isComplete() {

        this.__blockUntillWeHaveMoreObjectToProcess();
        
        return false;
    }

    shouldWriteToDisk() {
        return this.completedAllTransactions;
    }

    getCurrentObject() {
        if (!this.hasState) {
            this.updateState()
        }
        return this.__getNextObjectToAddToBatch();

    }

    getParameterFromObject(transaction) {
        return transaction.transaction_number;
    }

    async __blockUntillWeHaveMoreObjectToProcess() {
        while(this.objectsToProcess.length < 1) {
            this.helper.sleep(100000);
            
            console.log('TransactionsExporterFromToAddressProgressTracker: Waiting for more blocks to process');
            
            this.objectsToProcess = 
                this.mongoStateCollectionTracker.getNextBlocksToProcess(this.numberBlocksToProcessAtATime);
            
            if(this.objectsToProcess.length > 0) {
                break;
            }
         }
    }
    /**
     * This blocks untill we are able to get the block to process
     */
    async updateState() {

        const nextBlocksToProcess = 
            await this.mongoStateCollectionTracker.getNextBlocksToProcess(this.numberBlocksToProcessAtATime);
        this.objectsToProcess = 
            await this.mongoTransactionCollection.getTransactions(nextBlocksToProcess);

        this.__blockUntillWeHaveMoreObjectToProcess();

        this.hasState = true;
    }

    getFileLabel() {
        return "block_number_with_transactions_from_to_file_start_block_";
    }

    getBatchSize() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().web3_batch_size;
    }

    numberOfObjectsToWriteToDisk() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().number_objects_to_write_to_disk_at_a_time;
    }

    __getNextObjectToAddToBatch() {
        let transaction = null;

        if (this.objectsToProcess.length == 0) {
            this.completedAllTransactions = true;

            this.updateState();
        } else {
            this.completedAllTransactions = false;
        }

        transaction = this.objectsToProcess.shift();

        return transaction;
    }


}

module.exports = TransactionsExporterFromToAddressProgressTracker;