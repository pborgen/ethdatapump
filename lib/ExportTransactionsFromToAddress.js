const http = require('http');
const net = require('net');
const fs = require('fs');

const PromisifyBatchRequest = require('./PromisifyBatchRequest');
const Properties = require('./Properties');
const Web3ConnectionCreator = require('./Web3ConnectionCreator');
const CsvWriter = require('./CsvWriter');
const CsvReader = require('./helper/CsvReader');

class ExportTransactionsFromToAddress {
    constructor() {
        console.log('ExportTransactionsFromToAddress Created')

        this.properties = new Properties();
        
    }

    export (block_number_with_transactions_full_path) {

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const csvWriter = new CsvWriter();
    
        console.log('Exporting transactions from and to address');
        console.log('--------- Start ---------');
     
        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_number', title: 'transaction_number'},
            {id: 'to', title: 'to'},
            {id: 'from', title: 'from'},
        ];
    
        const batchSize = this.properties.getBatchSize();

        let counter = 0;
        let properties = new Properties();

        let start = async function() {
            
            let batch = new PromisifyBatchRequest(web3);
 
            const csvReader = new CsvReader();
            let blockNumberTransactionNumberList = 
                csvReader.read(
                    block_number_with_transactions_full_path, 
                    ['block_number', 'transaction_number']
                );
            
            const transactionCount = blockNumberTransactionNumberList.length;

            for (const blockNumberTransactionNumber of blockNumberTransactionNumberList) {
                counter++;

                let transactionNumber = blockNumberTransactionNumber['transaction_number'];
                console.log(transactionNumber)
                batch.add(web3.eth.getTransaction.request, transactionNumber);
                
                // If last iteration make sure to execute the batch
                let isThisTheLastIteration = (transactionCount - counter) == 0;
                let shouldExecuteTheBatch = counter % batchSize == 0;

                if (shouldExecuteTheBatch || isThisTheLastIteration) {
                    let transactions = await batch.execute();
                    let transactionsToAndFromList = [];
 
                    for (let transaction of transactions ) {
                        if (transaction == null) {
                            console.log('For some reason the transaction is null');
                            continue;
                        }
                        let blockNumber = transaction.blockNumber;
                        
                        let transactionsToAndFrom = 
                            {
                                block_number: blockNumber, 
                                transaction_number: transactionNumber,
                                to: transaction.to,
                                from: transaction.from
                            };
                        transactionsToAndFromList.push(transactionsToAndFrom);
                    }
                    
                    let fileName = 
                        'transactions_to_and_from_' + 
                        Date.now() + 
                        '.csv';
                    
                    csvWriter.write(
                        transactionsToAndFromList, 
                        header, 
                        properties.getExportDirectory() + '/transactions_to_and_from/' + fileName
                    );
 
                    // Clear our our array in memory
                    batch = new PromisifyBatchRequest(web3);
    
                    console.log('Processed ' + counter + ' blocks')
                }
            }
            
            console.log('Completed submitting ' + counter + ' transactions for processing')
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
module.exports = ExportTransactionsFromToAddress;