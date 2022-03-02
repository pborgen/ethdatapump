const PropertiesSingleton = require('../PropertiesSingleton');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const Exporter = require('./Exporter');
const TrackerExportTransactions = require('../tracker/TrackerExportTransactions');
const TransactionsExporterProgressTracker = 
    require('../block_progress_tracker/TransactionsExporterProgressTracker');

class TransactionsExporter {
    constructor() {
        console.log('TransactionsExporter Created')

        this.exporter = new Exporter();
        this.properties = PropertiesSingleton;
    }

    export() {

        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_hash', title: 'transaction_hash'},
        ];

        const objectToString = function(object) {
            const objectAsString = 
                object.block_number + ',' + 
                object.transaction_hash

            return objectAsString;
        }

        const processWeb3Data = function(blocks) {
            let exportList = [];

            for (let block of blocks ) {
                if (block == null) {
                    console.log('For some reason the block is null');
                    continue;
                }
                let blockNumber = block.number; 

                for (let transactionNumber of block.transactions) {
                    const blockNumberToTransaction = 
                        {block_number: blockNumber, transaction_hash: transactionNumber};
                    exportList.push(blockNumberToTransaction);
                }
            }

            return exportList;
        };

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const trackerExportTransactions = new TrackerExportTransactions();
        const transactionsExporterProgressTracker = 
            new TransactionsExporterProgressTracker(trackerExportTransactions);

        this.exporter.export(
            transactionsExporterProgressTracker,
            header, 
            web3.eth.getBlock.request,
            processWeb3Data,
            objectToString,
            this.properties.getExportDirectoryForTransactions()
        );
    }

}
module.exports = TransactionsExporter;