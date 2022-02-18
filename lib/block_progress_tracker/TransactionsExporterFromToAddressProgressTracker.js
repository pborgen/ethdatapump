const fs = require('fs');

const ProgressTracker = require("./ProgressTracker");
const PropertiesSingleton = require('../PropertiesSingleton');
const CsvReader = require('../helper/CsvReader');
const Helper = require('../helper/Helper');
const LockHelper = require('../helper/LockHelper');

class TransactionsExporterFromToAddressProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
        this.properties = PropertiesSingleton;
        this.csvReader = new CsvReader();
        this.helper = new Helper();
        this.lockHelper = new LockHelper("FromToAddressProgressTracker");

        this.currentFileNameBeingProcessed = null;
        this.objectsForCurrentFile = null;
        this.hasState = false;
        this.completedAllTransactionsForFile = false;
        this.allFilesToProcess = null;
    }

    isComplete() {
        let isComplete = this.__moreFilesToProcess();

        // make sure no new files got added
        
        return isComplete;
    }

    shouldWriteToDisk() {
        return this.completedAllTransactionsForFile;
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
        this.lockHelper.lock();
        
        this.allFilesToProcess = this.__getAllFileNamesToProcess();

        while(this.allFilesToProcess.length < 1) {
            this.helper.sleep(100000);
            this.allFilesToProcess = this.__getAllFileNamesToProcess();
        }

        this.hasState = true;
        const processingDirectory = 
            this.properties.getExportDirectoryForTransactions() + "/processing";

        // Move the file to the processing directory
        this.currentFileNameBeingProcessed = this.allFilesToProcess[0];

        // Create processing directory if needed
        if (!fs.existsSync(processingDirectory)) {
            fs.mkdirSync(processingDirectory, { recursive: true });
        }

        const fileInProcesssingDirectory = processingDirectory + '/' + this.currentFileNameBeingProcessed;

        fs.renameSync(
            this.properties.getExportDirectoryForTransactions() + '/' + this.currentFileNameBeingProcessed,
            fileInProcesssingDirectory
        );

        this.objectsForCurrentFile = this.__loadObjectsFromFile(fileInProcesssingDirectory);
        
        this.lockHelper.release();
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

        if (this.objectsForCurrentFile.length == 0) {
            //Move the current file being process to the processing directory
            this.__moveFileFromProcessingToProcessedDirectory(this.currentFileNameBeingProcessed);
            
            this.completedAllTransactionsForFile = true;

            this.updateState();
        } else {
            this.completedAllTransactionsForFile = false;
        }

        transaction = this.objectsForCurrentFile.shift();

        return transaction;
    }

    __moveFileFromProcessingToProcessedDirectory(fileName) {
        const transactionsDirectory = this.properties.getExportDirectoryForTransactions();
        const processedTransactionDirectory = this.properties.getExportDirectoryForProcessedTransactions();
        
        const currentFileFullPath = 
            this.properties.getExportDirectoryForProcessingTransactions() + '/' + fileName;

        fs.renameSync(currentFileFullPath, processedTransactionDirectory + '/' + fileName);
    }

    __getNextFileNameToProcess() {
        return this.allFilesToProcess[0];
    }

    __moreFilesToProcess() {
        return this.allFilesToProcess.length == 0;
    }

    __loadObjectsFromFile(fileToLoadFullPath, shouldFilter=true) {

        let returnValue = [];

        let blockNumberTransactionNumberList = 
            this.csvReader.read(
                fileToLoadFullPath, 
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

        for(let x = 0; x < files.length; x++) {
            
            let fileName = files[x];
            fileNamesToIsProcess.push(fileName);
        }

        return fileNamesToIsProcess;
    }

}

module.exports = TransactionsExporterFromToAddressProgressTracker;