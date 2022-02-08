
const fs = require('fs');

const PromisifyBatchRequest = require('../PromisifyBatchRequest');
const Properties = require('../Properties');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const CsvWriter = require('../CsvWriter');

class Exporter {
    constructor() {
        console.log('Export Created')

        this.properties = new Properties();
        this.csvWriter = new CsvWriter();
    }

    export(tracker,
           blockProgressTracker,
           header, 
           web3MethodToBeCalled, 
           processWeb3DataClosure, 
           exportDirectoryFullPath) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const csvWriter = new CsvWriter();
     
        const web3BatchSize = blockProgressTracker.getBatchSize();
        const csvRowMaxCount = blockProgressTracker.maxCsvRowCount();
        const writeToDisk = this.__writeToDisk;

        // Create the directory if it does not exists
        if (!fs.existsSync(exportDirectoryFullPath)) {
            fs.mkdirSync(exportDirectoryFullPath, { recursive: true });
        }

        let start = async function() {

            let endBlockNumber = await web3.eth.getBlockNumber();

            blockProgressTracker.updateState();
            blockProgressTracker.setEndBlockNumber(endBlockNumber);

            const startBlockNumber = blockProgressTracker.getStartBlockNumber();

            console.log('Exporting transactions from blocks');
            console.log('--------- Start ---------');
            const numberBlocksToProcess = endBlockNumber - startBlockNumber;
        
            console.log('About to process ' + numberBlocksToProcess + ' blocks');
    
            let counter = 0;
            let batch = new PromisifyBatchRequest(web3);
            let exportList = [];
            let startDate = new Date();

            while (!blockProgressTracker.isComplete()) {
                counter++;
                let currentBlockNumber = blockProgressTracker.getCurrentBlockNumber();
                let parameter = blockProgressTracker.getCurrentWeb3MethodParamter();
                
                batch.add(web3MethodToBeCalled, parameter);

                if (counter % web3BatchSize == 0 || currentBlockNumber == endBlockNumber) {
                    let web3Data = await batch.execute();
                    
                    exportList = exportList.concat(processWeb3DataClosure(web3Data));

                    let isTheEnd = currentBlockNumber == endBlockNumber
                    
                    let shouldWriteToDisk = 
                        isTheEnd || exportList.length >= csvRowMaxCount;

                    if (shouldWriteToDisk) {
                        let seconds = (new Date().getTime() - startDate.getTime()) / 1000
                        let elapsedTime = Math.abs(seconds);
                        console.log(
                            'Time to process ' + exportList.length + ' requests was ' + elapsedTime + ' seconds.\n' +
                            'Processing ' + Math.round(exportList.length / seconds) + ' requests a second' +
                            'Batch Size = ' + web3BatchSize
                        );

                        writeToDisk(
                            exportList, 
                            tracker, 
                            csvWriter, 
                            header, 
                            exportDirectoryFullPath,
                            blockProgressTracker.getFileLabel()
                        );

                        endBlockNumber = await web3.eth.getBlockNumber();
                        exportList = [];
                        startTime = Date.now();
                    }

                    batch = new PromisifyBatchRequest(web3);

                    console.log('Processed ' + counter + ' requests');
                }

                blockProgressTracker.update(currentBlockNumber + 1, endBlockNumber);
            }
            
            console.log('Completed submitting ' + counter + ' requests for processing');
        }

        try {
            start();
        } catch(e) {
            console.error(e.stack || e);
        }
    }

    __writeToDisk (exportList, tracker, csvWriter, header, exportDirectoryFullPath, fileLabel) {
        let startBlockNumberWrittenToDisk = 0;
        let endBlockNumberWrittenToDisk = 0;
        
        // Find the smallest block number and the largest block number
        // that is going to be written to disk
        for (let index = 0; index < exportList.length; index++) {
            let tuple = exportList[index];
            let blockNumber = tuple['block_number']
            
            if (index == 0) {
                startBlockNumberWrittenToDisk = blockNumber;
            }

            if (blockNumber < startBlockNumberWrittenToDisk) {
                startBlockNumberWrittenToDisk = blockNumber;
            }

            if (blockNumber > endBlockNumberWrittenToDisk) {
                endBlockNumberWrittenToDisk = blockNumber;
            }
        }

        let fileName = 
            fileLabel + 
            startBlockNumberWrittenToDisk + 
            '_end_block_' +
            endBlockNumberWrittenToDisk + 
            '.csv';
        
        csvWriter.write(
            exportList, 
            header, 
            exportDirectoryFullPath + '/' + fileName
        );

        tracker.update(
            endBlockNumberWrittenToDisk
        );

        console.log('Processed blocks up untill block number ' + endBlockNumberWrittenToDisk.toLocaleString());
    }
    __findLastBlockExported() {
        const exportDirectory = this.properties.getExportDirectoryForTransactions();
        let lastBlockProcessed = 0;

        var files = fs.readdirSync(exportDirectory);

        files.forEach(fileName => {
            const indexEndBlockCharaters = '_end_block_';
            const indexOfEndBlock = fileName.indexOf(indexEndBlockCharaters);
            const endBlockString = fileName.substring(indexOfEndBlock + indexEndBlockCharaters.length);
            const endBlockInt = parseInt(endBlockString);
            
            if (endBlockInt > lastBlockProcessed) {
                lastBlockProcessed = endBlockInt;
            }
        });

        return lastBlockProcessed;
    }
}
module.exports = Exporter;