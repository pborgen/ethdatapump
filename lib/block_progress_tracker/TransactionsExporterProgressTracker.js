const ProgressTracker = require("./ProgressTracker");
const Web3Helper = require("../helper/Web3Helper");
const Helper = require('../helper/Helper');
const PropertiesSingleton = require('../PropertiesSingleton');

class TransactionsExporterProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
        this.web3Helper = new Web3Helper();
        this.helper = new Helper();
        this.properties = PropertiesSingleton;
        this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
    }

    updateState() {
        //Get the Current block number we need to process if we do not have it already
        if (this.getCurrentBlockNumberToBeProcessed() == null) {
            this.setCurrentBlockNumberToBeProcessed(this.__getNextBlockToBeProcessed());
        }

        this.__lastBlockNumberToBeProcessed = this.web3Helper.latestBlockNumber();
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

    getCurrentObject() {
        let returnValue = this.getCurrentBlockNumberToBeProcessed();

        this.setCurrentBlockNumberToBeProcessed(returnValue + 1);

        return returnValue;
    }

    getParameterFromObject(blockNumber) {
        return blockNumber;
    }

    getFileLabel() {
        return "block_number_with_transactions_file_start_block_";
    }

    getBatchSize() {
        return this.properties.getExportTransactionsPerformanceConfiguration().web3_batch_size;
    }

    maxCsvRowCount() {
        return this.properties.getExportTransactionsPerformanceConfiguration().csv_row_max_count;
    }

    __getNextBlockToBeProcessed() {
        let nextBlockToBeProcessed = null;

        let filesToBeProcessed = 
            this.helper.getAllFileNamesInDirectory(this.properties.getExportDirectoryForTransactions());
        
        // Find where we left off either from the directory or from the tracker file
        if (filesToBeProcessed.length > 0) {
            let largestEndBlockNumber = -1;

            for(let x = 0; x < filesToBeProcessed.length; x++) {
            
                let fileName = filesToBeProcessed[x];
                let currentEndBlockNumber = this.helper.parseFileNameGetEndBlockNumber(fileName);
                if (currentEndBlockNumber > largestEndBlockNumber) {
                    largestEndBlockNumber = currentEndBlockNumber;
                }
            }

            nextBlockToBeProcessed = largestEndBlockNumber + 1;
            
        } else {
            nextBlockToBeProcessed = this.tracker.getLastBlockProcessed() + 1;
        }
        
        return nextBlockToBeProcessed;
    }
}

module.exports = TransactionsExporterProgressTracker;