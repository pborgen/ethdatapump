const http = require('http');
const net = require('net');
const fs = require('fs');

const PromisifyBatchRequest = require('./PromisifyBatchRequest');
const Properties = require('../lib/Properties');
const Web3ConnectionCreator = require('./Web3ConnectionCreator');
const CsvWriter = require('./CsvWriter');

class ExportTransactions {
    constructor() {
        console.log('ExportTransactions Created')

        this.properties = new Properties();
    }

    export (start_block, end_block) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const csvWriter = new CsvWriter();
    
        console.log('Exporting transactions from blocks');
        console.log('--------- Start ---------');
        const number_blocks_to_process = end_block - start_block;
    
        console.log('About to process ' + number_blocks_to_process + ' blocks');
    
        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_number', title: 'transaction_number'},
        ];
    
        const batch_size = this.properties.getBatchSize();

        // Can we pick up where we left off
        const lastBlockExported = this.findLastBlockExported();
        if (lastBlockExported != 0) {
            start_block = lastBlockExported + 1
        }

        let counter = 0;
        let start_blocknumber_written_to_disk = start_block;
        
        let properties = new Properties();

        let start = async function() {
            
            let batch = new PromisifyBatchRequest(web3);
    
            var promises_getBlock = [];
            var transactions = [];
        
            for (let current_block_number = start_block; current_block_number <= end_block; current_block_number++) {
        
                counter++;
        
                batch.add(web3.eth.getBlock.request, current_block_number);
        
                if (counter % batch_size == 0 || current_block_number == end_block) {
                    let blocks = await batch.execute();
                    let block_number_to_transaction_List = [];
                    let end_blocknumber_written_to_disk = null;

                    for (let block of blocks ) {
                        if (block == null) {
                            console.log('For some reason the block is null');
                        }
                        let blockNumber = block.number;
        
                        end_blocknumber_written_to_disk = blockNumber;
        
                        for (let transactionNumber of block.transactions) {
                            var block_number_to_transaction = {block_number: blockNumber, transaction_number: transactionNumber};
                            block_number_to_transaction_List.push(block_number_to_transaction);
                        }
                    }
                    
                    let fileName = 
                        'block_number_with_transactions_file_start_block_' + 
                        start_blocknumber_written_to_disk + 
                        '_end_block_' +
                        end_blocknumber_written_to_disk + 
                        '.csv';
                    
                    csvWriter.write(
                        block_number_to_transaction_List, 
                        header, 
                        properties.getExportDirectory() + '/' + fileName
                    );
 
                    start_blocknumber_written_to_disk = end_blocknumber_written_to_disk + 1
                    
                    // Clear our our array in memory
                    batch = new PromisifyBatchRequest(web3);
    
                    console.log('Processed ' + counter + ' blocks')
                }
            }
            
            console.log('Completed submitting ' + counter + ' blocks for processing')
    
            
     
    
            // for await (let blocks of promises_getBlock) {
            //     for (let block of blocks ) {
            //         let blockNumber = block.number;
    
            //         end_blocknumber_written_to_disk = blockNumber;
    
            //         for (let transactionNumber of block.transactions) {
            //             var block_number_to_transaction = {block_number: blockNumber, transaction_number: transactionNumber};
            //             block_number_to_transaction_List.push(block_number_to_transaction);
            //         }
            //     }
                
            //     // Write the csv to disk every so often
            //     if(block_number_to_transaction_List.length > 50000) {
                    
            //         let fileName = 
            //             'block_number_with_transactions_file_start_block_' + 
            //             start_blocknumber_written_to_disk + 
            //             '_end_block_' +
            //             end_blocknumber_written_to_disk
            //             '.csv';
                    
            //         csvWriter.write(block_number_to_transaction_List, header, properties.getExportDirectory() + '/' + fileName);
                    
            //         start_blocknumber_written_to_disk = end_blocknumber_written_to_disk + 1
                    
            //         // Clear our our array in memory
            //         block_number_to_transaction_List = []
    
            //         console.log('Wrote to disk ' + fileName);
            //     }
            // }
    
            // if (block_number_to_transaction_List.length > 0) {
            //     let fileName = 
            //             'block_number_with_transactions_file_start_block_' + 
            //             start_blocknumber_written_to_disk + 
            //             '_end_block_' +
            //             end_blocknumber_written_to_disk
            //             '.csv';
    
            //     csvWriter.write(
            //         block_number_to_transaction_List, 
            //         header, 
            //         properties.getExportDirectory() + '/' + fileName
            //     );
            // }
            
            // const header = [
            //     {id: 'block_number', title: 'block_number'},
            //     {id: 'transaction_number', title: 'transaction_number'},
            // ];
            // csvWriter.write(block_number_to_transaction_List, header, '/mnt/crypto/block_number_with_transactions.csv');
            // const csvWriter = createCsvWriter({
            //     path: '/mnt/crypto/block_number_with_transactions.csv',
            //     header: [
            //       {id: 'block_number', title: 'block_number'},
            //       {id: 'transaction_number', title: 'transaction_number'},
            //     ]
            // });
        
            // csvWriter
            //     .writeRecords(block_number_to_transaction_List)
            //     .then(()=> console.log('The CSV file was written successfully'));
        
            // console.log('Done');
        }
        try {
            start();
        } catch(e) {
            console.error(e.stack || e);
        }
    }

    findLastBlockExported() {
        const exportDirectory = this.properties.getExportDirectory();
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
module.exports = ExportTransactions;