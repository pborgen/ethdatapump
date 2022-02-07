const fs = require('fs');

const BlockProgressTracker = require("./BlockProgressTracker");
const Properties = require('../Properties');

class TransactionsExporterFromToAddressBlockProgressTracker extends BlockProgressTracker{

    transactionsForCurrentBlock = null;
    hasInit = false;
    allFilesToProcessMap = null;

    constructor(tracker) { 
        super(tracker);
        this.properties = new Properties();
    }

    getCurrentWeb3MethodParamter() {
        if (!this.hasInit) {
            this.init()
        }
        return this.__getNextTransactionToAddToBatch();

    }

    init() {
        this.allFilesToProcessMap = this.__getAllFilesToProcessMap();
    }

    // __getNextTransactionToAddToBatch() {

    //}
    __getAllFilesToProcessMap() {
        const fileNameToIsProcessedMap = [];

        const exportDirectory = this.properties.getExportDirectoryForTransactions();
        const files = fs.readdirSync(exportDirectory);

        for(let x = 0; x < files.length; x++) {
            
            let fileName = files[x];

            let startBlockNumber = this.__parseFileNameGetStartBlockNumber(fileName);
            let endBlockNumber = this.__parseFileNameGetEndBlockNumber(fileName);

            let element = 
                { 
                    name: fileName, 
                    startBlockNumber: startBlockNumber, 
                    endBlockNumber: endBlockNumber,
                    isProcessed: false
                }
            fileNameToIsProcessed.push(element);
        }

        return fileNameToIsProcessedMap;
    }
    // __getTransactionsForCurrentBlock() {

    // }
    // __findFileForCurrentBlock() {
    //     continue;
    //     //TODOHIGH
    // }

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

    // __readFile(fileName) {

    // }

}

module.exports = TransactionsExporterFromToAddressBlockProgressTracker;