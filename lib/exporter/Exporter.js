
const fs = require('fs');

const PromisifyBatchRequest = require('../PromisifyBatchRequest');
const PropertiesSingleton = require('../PropertiesSingleton');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const CsvWriter = require('../CsvWriter');
const Web3Helper = require('../helper/Web3Helper');

class Exporter {
    constructor() {
        console.log('Export Created')

        this.properties = PropertiesSingleton;
        this.csvWriter = new CsvWriter();
        this.web3Helper = new Web3Helper();
    }

    export(progressTracker,
           header, 
           web3MethodToBeCalled, 
           processWeb3DataClosure,
           objectToStringClosure,
           exportDirectoryFullPath) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const csvWriter = new CsvWriter();

        const web3BatchSize = progressTracker.getBatchSize();
        const csvRowMaxCount = progressTracker.maxCsvRowCount();
        const writeToDisk = this.__writeToDisk;
        
        console.log(
            'csvRowMaxCount =' + csvRowMaxCount +'\n' +
            'Batch Size = ' + web3BatchSize
        );

        // Create the directory if it does not exists
        if (!fs.existsSync(exportDirectoryFullPath)) {
            fs.mkdirSync(exportDirectoryFullPath, { recursive: true });
        }

        let start = async function() {

            progressTracker.updateState();

            let counter = 0;
            let batch = new PromisifyBatchRequest(web3);

            let startDate = new Date();

            while (!progressTracker.isComplete()) {
                counter++;

                let object = progressTracker.getCurrentObject();
    
                if (progressTracker.shouldWriteToDisk()) {
                    let seconds = (new Date().getTime() - startDate.getTime()) / 1000
                    let elapsedTime = Math.abs(seconds);
                    console.log(
                        'Time to process ' + progressTracker.getListToExport().length + ' requests was ' + elapsedTime + ' seconds.\n' +
                        'Processing ' + Math.round(progressTracker.getListToExport().length / seconds) + ' requests a second.\n' +
                        'Batch Size = ' + web3BatchSize
                    );

                    writeToDisk(
                        progressTracker, 
                        csvWriter, 
                        header, 
                        exportDirectoryFullPath,
                        objectToStringClosure
                    );

                    progressTracker.setListToExport([]);
                    startDate = new Date();
                }

                let parameter = progressTracker.getParameterFromObject(object);

                batch.add(web3MethodToBeCalled, parameter);

                if (counter % web3BatchSize == 0) {
                    let web3Data = await batch.execute();
                    
                    let newDataList = processWeb3DataClosure(web3Data);
                    
                    progressTracker.setListToExport(
                        progressTracker.getListToExport().concat(newDataList)
                    );

                    batch = new PromisifyBatchRequest(web3);

                    if (counter % 1000 == 0 ) {
                        console.log(
                            'Processed ' + counter + ' requests');
                    }
                }
            }
            
            console.log('Completed submitting ' + counter + ' requests for processing');
        }

        try {
            start();
        } catch(e) {
            console.error(e.stack || e);
        }
    }

    __writeToDisk (progressTracker, csvWriter, header, exportDirectoryFullPath, objectToStringClosure) {
        
        let startBlockNumberWrittenToDisk = 0;
        let endBlockNumberWrittenToDisk = 0;

        const listToExport = progressTracker.getListToExport();

        // Find the smallest block number and the largest block number
        // that is going to be written to disk
        for (let index = 0; index < listToExport.length; index++) {
            let tuple = listToExport[index];
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
            progressTracker.getFileLabel() + 
            startBlockNumberWrittenToDisk + 
            '_end_block_' +
            endBlockNumberWrittenToDisk + 
            '.csv';
        
        csvWriter.write(
            listToExport, 
            header,
            exportDirectoryFullPath + '/' + fileName, 
            objectToStringClosure
        );

        progressTracker.getTracker().update(
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