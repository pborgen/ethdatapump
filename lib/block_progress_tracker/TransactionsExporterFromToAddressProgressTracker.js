const fs = require('fs');

const ProgressTracker = require("./ProgressTracker");
const PropertiesSingleton = require('../PropertiesSingleton');
const CsvReader = require('../helper/CsvReader');
const Helper = require('../helper/Helper');

class TransactionsExporterFromToAddressProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
        this.properties = PropertiesSingleton;
        this.csvReader = new CsvReader();
        this.helper = new Helper();

        this.currentFileNameBeingProcessed = null;
        this.objectsForCurrentFile = null;
        this.hasState = false;
        this.allFilesToProcess = null;
    }

    isComplete() {
        let isComplete = this.__moreFilesToProcess();

        // make sure no new files got added
        
        return isComplete;
    }

    shouldWriteToDisk() {
        let shouldWriteToDisk = false;

        // Check the length
        const listToExportLength = this.getListToExport().length;
        let reachedCSVMax = listToExportLength > this.maxCsvRowCount();
        
        if (reachedCSVMax) {
            shouldWriteToDisk = true;
            // Make sure all data for a block is exported to the same file even if it means
            // we go over our csv max.
            for (let x = 0; x < this.objectsForCurrentFile.length; x++) {
                let blockNumber = this.objectsForCurrentFile[x].block_number;

                if (this.getCurrentBlockNumber() == blockNumber) {
                    shouldWriteToDisk = false;
                    break;
                }
            }
        }

        return shouldWriteToDisk;
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

    updateState() {
        this.allFilesToProcess = this.__getAllFileNamesToProcess();

        while(this.allFilesToProcess.length < 1) {
            this.helper.sleep(10000);
            this.allFilesToProcess = this.__getAllFileNamesToProcess();
        }

        this.hasState = true;

        this.currentFileNameBeingProcessed = this.allFilesToProcess[0];

        this.objectsForCurrentFile = this.__loadObjectsFromFile(this.currentFileNameBeingProcessed);
        
    }

    getFileLabel() {
        return "block_number_with_transactions_from_to_file_start_block_";
    }

    getBatchSize() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().web3_batch_size;
    }

    maxCsvRowCount() {
        return this.properties.getExportTransactionsFromToPerformanceConfiguration().csv_row_max_count;
    }

    __getNextObjectToAddToBatch() {
        let transaction = null;

        if (this.objectsForCurrentFile.length > 0) {
            transaction = this.objectsForCurrentFile.shift();
        } else {
            //Move the current file being process to the processing directory
            this.__moveFileToProcessedDirectory(this.currentFileNameBeingProcessed);

            this.updateState();

            transaction = this.objectsForCurrentFile.shift();
        }

        return transaction;
    }

    __moveFileToProcessedDirectory(fileName) {
        const transactionsDirectory = this.properties.getExportDirectoryForTransactions();
        const processedTransactionDirectory = this.properties.getExportDirectoryForProcessedTransactions();
        
        const currentFileFullPath = transactionsDirectory + '/' + fileName;

        fs.renameSync(currentFileFullPath, processedTransactionDirectory + '/' + fileName);
    }

    __getNextFileNameToProcess() {
        return this.allFilesToProcess[0];
    }

    __moreFilesToProcess() {
        return this.allFilesToProcess.length == 0;
    }

    __loadObjectsFromFile(fileName, shouldFilter=true) {
        const exportDirectory = this.properties.getExportDirectoryForTransactions();

        let returnValue = [];

        let blockNumberTransactionNumberList = 
            this.csvReader.read(
                exportDirectory + '/' + fileName, 
                ['block_number', 'transaction_number']
            );
        
        const startBlockNumberFromTrackerYaml = this.tracker.getStartBlockNumber();
        
        // Make sure we are only processing transactions larger then the StartBlockNumber in 
        // the tracker.yaml configuration
        if (shouldFilter) {
            for (let x = 0; x < blockNumberTransactionNumberList.length; x++) {
                let blockNumber = parseInt(blockNumberTransactionNumberList[x].block_number);

                if (blockNumber >= startBlockNumberFromTrackerYaml) {
                    returnValue.push(blockNumberTransactionNumberList[x]);
                }
            }
        } else {
            returnValue = blockNumberTransactionNumberList;
        }

        return returnValue;
    }

    __getAllFileNamesToProcess() {
        const fileNamesToIsProcess = [];

        const exportDirectory = this.properties.getExportDirectoryForTransactions();
        const files = fs.readdirSync(exportDirectory);

        // From the tracker.yaml
        const startBlockNumberFromTrackerYaml = this.tracker.getStartBlockNumber();

        for(let x = 0; x < files.length; x++) {
            
            let fileName = files[x];

            let startBlockNumber = this.__parseFileNameGetStartBlockNumber(fileName);

            // Do not add files that have a start block that is before what is specified in the tracker.yaml
            if (startBlockNumber >= startBlockNumberFromTrackerYaml) {
                fileNamesToIsProcess.push(fileName);
            }
        }

        return fileNamesToIsProcess;
    }

    __parseFileNameGetEndBlockNumber(fileName) {
        const indexEndBlockCharaters = '_end_block_';
        const indexOfEndBlock = fileName.indexOf(indexEndBlockCharaters);
        const endBlockString = fileName.substring(indexOfEndBlock + indexEndBlockCharaters.length);
        const endBlockInt = parseInt(endBlockString);
        return endBlockInt;
    }

    __parseFileNameGetStartBlockNumber(fileName) {
        const indexStartBlockCharaters = '_start_block_';
        const indexOfStartBlock = fileName.indexOf(indexStartBlockCharaters);
        const startBlockString = fileName.substring(indexOfStartBlock + indexStartBlockCharaters.length);
        const startBlockInt = parseInt(startBlockString);

        return startBlockInt;
    }

}

module.exports = TransactionsExporterFromToAddressProgressTracker;