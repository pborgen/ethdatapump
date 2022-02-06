const http = require('http');
const net = require('net');
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

    export(tracker, header, web3MethodToBeCalled, processWeb3DataClosure, exportDirectoryFullPath) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const csvWriter = new CsvWriter();
     
        const web3BatchSize = this.properties.getWeb3BatchSize();
        const csvRowMaxCount = this.properties.getCsvRowMaxCount();
        const writeToDisk = this.__writeToDisk;

        // Create the directory if it does not exists
        if (!fs.existsSync(exportDirectoryFullPath)) {
            fs.mkdirSync(exportDirectoryFullPath, { recursive: true });
        }

        let start = async function() {
            
            // Can we pick up where we left off
            const lastBlockExported = tracker.getEndBlockNumber();
            const start_block = lastBlockExported + 1;
            let end_block = await web3.eth.getBlockNumber();

            console.log('Exporting transactions from blocks');
            console.log('--------- Start ---------');
            const numberBlocksToProcess = end_block - start_block;
        
            console.log('About to process ' + numberBlocksToProcess + ' blocks');
    
            let counter = 0;
            let batch = new PromisifyBatchRequest(web3);
            let exportList = [];
            
            for (let currentBlockNumber = start_block; currentBlockNumber <= end_block; currentBlockNumber++) {

                counter++;
        
                batch.add(web3MethodToBeCalled, currentBlockNumber);
        
                if (counter % web3BatchSize == 0 || currentBlockNumber == end_block) {
                    let web3Data = await batch.execute();
                    
                    exportList = exportList.concat(processWeb3DataClosure(web3Data));

                    let isTheEnd = currentBlockNumber == end_block
                    
                    let shouldWriteToDisk = 
                        isTheEnd || exportList.length >= csvRowMaxCount;

                    if (shouldWriteToDisk) {
                        
                        writeToDisk(exportList, tracker, csvWriter, header, exportDirectoryFullPath);

                        end_block = await web3.eth.getBlockNumber();
                        exportList = [];
                    }

                    batch = new PromisifyBatchRequest(web3);

                    console.log('Processed ' + counter + ' blocks');
                }
            }
            
            console.log('Completed submitting ' + counter + ' blocks for processing');
        }

        try {
            start();
        } catch(e) {
            console.error(e.stack || e);
        }
    }

    __writeToDisk (exportList, tracker, csvWriter, header, exportDirectoryFullPath) {
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
            'block_number_with_transactions_file_start_block_' + 
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