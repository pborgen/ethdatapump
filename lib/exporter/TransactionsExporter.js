const Properties = require('../Properties');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const Exporter = require('./Exporter');
const TrackerExportTransactions = require('../TrackerExportTransactions');
const TransactionsExporterBlockProgressTracker = 
    require('../block_progress_tracker/TransactionsExporterBlockProgressTracker');

class TransactionsExporter {
    constructor() {
        console.log('TransactionsExporter Created')

        this.exporter = new Exporter();
        this.properties = new Properties();
    }

    export() {

        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_number', title: 'transaction_number'},
        ];

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
                        {block_number: blockNumber, transaction_number: transactionNumber};
                    exportList.push(blockNumberToTransaction);
                }
            }

            return exportList;
        };

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const trackerExportTransactions = new TrackerExportTransactions();
        const transactionsExporterBlockProgressTracker = 
            new TransactionsExporterBlockProgressTracker(trackerExportTransactions);

        this.exporter.export(
            trackerExportTransactions,
            transactionsExporterBlockProgressTracker,
            header, 
            web3.eth.getBlock.request,
            processWeb3Data,
            this.properties.getExportDirectoryForTransactions()
        );
    }

}
module.exports = TransactionsExporter;