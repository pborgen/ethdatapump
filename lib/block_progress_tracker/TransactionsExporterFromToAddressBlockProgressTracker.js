const fs = require('fs');

const BlockProgressTracker = require("./BlockProgressTracker");
const Properties = require('../Properties');
const CsvReader = require('../helper/CsvReader');

class TransactionsExporterFromToAddressBlockProgressTracker extends BlockProgressTracker{



    constructor(tracker) { 
        super(tracker);
        this.properties = new Properties();
        this.csvReader = new CsvReader();

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

    getCurrentWeb3MethodParamter() {
        if (!this.hasState) {
            this.updateState()
        }
        return this.__getNextTransactionToAddToBatch();

    }

    updateState() {
        this.allFilesToProcess = this.__getAllFilesToProcessMap();

        if (this.allFilesToProcess.length == 0) {
            console.log('No more files to process');
            this.hasState = false;
        } else {
            this.hasState = true;

            this.currentFileNameBeingProcessed = this.__getNextFileNameToProcess();

            this.objectsForCurrentFile = this.__loadObjectsFromFile(this.currentFileNameBeingProcessed);
        }  
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

    __getNextTransactionToAddToBatch() {
        let transaction = null;

        if (this.objectsForCurrentFile.length > 0) {
            transaction = this.objectsForCurrentFile.shift();
        } else {
            //Move the current file being process to the processing directory
            this.__moveFileToProcessingDirectory(this.currentFileNameBeingProcessed);

            // There are no more transactions to process for the current file
            // Load the next file and if needed check to see if more files were added
            // that need to be processed
            if (this.__moreFilesToProcess()) {
                
                this.currentFileNameBeingProcessed = this.__getNextFileNameToProcess();
                this.objectsForCurrentFile = this.__loadObjectsFromFile(this.currentFileNameBeingProcessed);

                transaction = this.objectsForCurrentFile.shift();
                
            } else {
                console.log('Complete processing all files');
                // TODOHIGH: Look for more files
            }
        }

        return transaction.transaction_number;
    }

    __moveFileToProcessingDirectory(fileName) {
        const transactionsDirectory = this.properties.getExportDirectoryForTransactions();
        const processedTransactionDirectory = this.properties.getExportDirectoryForProcessedTransactions();
        
        const currentFileFullPath = transactionsDirectory + '/' + fileName;

        fs.renameSync(currentFileFullPath, processedTransactionDirectory + '/' + fileName);
    }
    __getNextFileNameToProcess() {
        // Should always call __moreFilesToProcess before this method is called
        let fileName = null
        for (let x = 0; x < this.allFilesToProcess.length; x++) {
            if (!this.allFilesToProcess[x].isProcessed) {
                fileName = this.allFilesToProcess[x].fileName;
                break;
            }
        }

        return fileName;
    }
    __moreFilesToProcess() {
        let moreFilesToProcess = true;

        for (let x = 0; x < this.allFilesToProcess.length; x++) {
            if (!this.allFilesToProcess[x].isProcessed) {
                moreFilesToProcess = false;
            }
        }

        return moreFilesToProcess;
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

    __getAllFilesToProcessMap() {
        const fileNameToIsProcess = [];

        const exportDirectory = this.properties.getExportDirectoryForTransactions();
        const files = fs.readdirSync(exportDirectory);

        // From the tracker.yaml
        const startBlockNumberFromTrackerYaml = this.tracker.getStartBlockNumber();

        for(let x = 0; x < files.length; x++) {
            
            let fileName = files[x];

            let startBlockNumber = this.__parseFileNameGetStartBlockNumber(fileName);
            let endBlockNumber = this.__parseFileNameGetEndBlockNumber(fileName);

            // Do not add files that have a start block that is before what is specified in the tracker.yaml
            if (startBlockNumber >= startBlockNumberFromTrackerYaml) {
                let element = 
                { 
                    fileName: fileName, 
                    startBlockNumber: startBlockNumber, 
                    endBlockNumber: endBlockNumber,
                    isProcessed: false
                }
                fileNameToIsProcess.push(element);
            }

        }

        return fileNameToIsProcess;
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

module.exports = TransactionsExporterFromToAddressBlockProgressTracker;