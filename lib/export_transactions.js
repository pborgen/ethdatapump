var http = require('http');
var Web3 = require('web3');
var net = require('net');

const PromisifyBatchRequest = require('./PromisifyBatchRequest');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const web3_url = 'https://mainnet.infura.io/v3/6a528c17b68a40b5bc84190aabb81c19'

module.exports = function(start_block, end_block, batch_size) {
    console.log('Exporting transactions from blocks');
    console.log('--------- Start ---------');
    const number_blocks_to_process = end_block - start_block;

    console.log('About to process ' + number_blocks_to_process + ' blocks');

    let counter = 0;
    const web3_url = 'https://mainnet.infura.io/v3/6a528c17b68a40b5bc84190aabb81c19'
    var web3 = new Web3(web3_url, net);

    let start = async function() {
        
        let batch = new PromisifyBatchRequest(web3);
        var promises_getBlock = [];
        var transactions = [];
    
        for (let current_block_number = start_block; current_block_number <= end_block; current_block_number++) {
    
            counter++;
    
            batch.add(web3.eth.getBlock.request, current_block_number);
            
    
            if (counter % batch_size == 0 || current_block_number == end_block) {
                promises_getBlock = promises_getBlock.concat(batch.execute());

                // only if we are not on the last block
                if (current_block_number != end_block) {
                    batch = new PromisifyBatchRequest(web3);
                }

                console.log('Processed ' + counter + ' blocks')
            }
        }
        
        console.log('Completed submitting ' + counter + ' blocks for processing')

        let block_number_to_transaction_List = [];
    
        for await (let blocks of promises_getBlock) {
            for (let block of blocks ) {
                let blockNumber = block.number;
    
                for (let transactionNumber of block.transactions) {
                    var block_number_to_transaction = {block_number: blockNumber, transaction_number: transactionNumber};
                    block_number_to_transaction_List.push(block_number_to_transaction);
                }
            }
        }
    
        const csvWriter = createCsvWriter({
            path: '/mnt/crypto/block_number_with_transactions.csv',
            header: [
              {id: 'block_number', title: 'block_number'},
              {id: 'transaction_number', title: 'transaction_number'},
            ]
        });
    
        csvWriter
            .writeRecords(block_number_to_transaction_List)
            .then(()=> console.log('The CSV file was written successfully'));
    
        console.log('Done');
    }

    start();
};