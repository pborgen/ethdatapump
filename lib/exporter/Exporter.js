
const fs = require('fs');

const PromisifyBatchRequest = require('../PromisifyBatchRequest');
const PropertiesSingleton = require('../PropertiesSingleton');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const CsvWriter = require('../CsvWriter');
const Web3Helper = require('../helper/Web3Helper');
const Mongo = require('../db/Mongo');

class Exporter {
    constructor() {
        console.log('Export Created')

        this.properties = PropertiesSingleton;
        this.csvWriter = new CsvWriter();
        this.web3Helper = new Web3Helper();
        this.mongo = new Mongo();
    }

    export(progressTracker,
           web3MethodToBeCalled, 
           processWeb3DataClosure) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const mongoWriter = new Mongo();

        const web3BatchSize =  progressTracker.getBatchSize();
        const numberOfObjectsToWriteToDisk = progressTracker.numberOfObjectsToWriteToDisk();
        const writeToDisk = this.__writeToDisk;
        
        console.log(
            'numberOfObjectsToWriteToDisk = ' + numberOfObjectsToWriteToDisk +'\n' +
            'Batch Size = ' + web3BatchSize
        );

        let start = async function() {

            let counter = 0;
            let batch = new PromisifyBatchRequest(web3);

            let startDate = new Date();

            while (true) {
                counter++;

                let object = await progressTracker.getCurrentObject();
    
                if (progressTracker.shouldWriteToDisk()) {
                    let seconds = (new Date().getTime() - startDate.getTime()) / 1000
                    let elapsedTime = Math.abs(seconds);
                    console.log(
                        'Time to process ' + progressTracker.getListToExport().length + ' requests was ' + elapsedTime + ' seconds.\n' +
                        'Processing ' + Math.round(progressTracker.getListToExport().length / seconds) + ' requests a second.\n' +
                        'Batch Size = ' + web3BatchSize
                    );

                    await writeToDisk(
                        progressTracker, 
                        mongoWriter
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
                            'Processed ' + counter.toLocaleString() + ' requests');
                    }
                }
            }
            
            console.log('Completed submitting ' + counter.toLocaleString() + ' requests for processing');
        }

        try {
 
            start();
        } catch(e) {
            console.error(e.stack || e);
        }
    }

    async __writeToDisk (progressTracker, writer) {
        
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

        let mongoResult = 
            await writer.insert(
                listToExport,
                progressTracker.getMongoDbName(),
                progressTracker.getMongoDbCollectionName()
            );

        // Error Check
        let acknowledged = mongoResult.acknowledged;
        let insertedCount = mongoResult.insertedCount;

        if (acknowledged == false || insertedCount != listToExport.length) {
            console.error("Error sending objects to Mongo.");
            process.exit(1)

        }

        // Extract the distinct block numbers that were processed
        let dinstinctBlocksProcessed = [];
        for(let x = 0; x < listToExport.length; x++) {
            dinstinctBlocksProcessed.push(listToExport[x].block_number);
        }
        dinstinctBlocksProcessed = [...new Set(dinstinctBlocksProcessed)];

        await progressTracker.updateTracker(dinstinctBlocksProcessed);

        console.log('Processed blocks up untill block number ' + endBlockNumberWrittenToDisk.toLocaleString());
    }

}
module.exports = Exporter;