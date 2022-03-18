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

        const processWeb3Data = function(blocks) {
            let exportList = [];

            for (let block of blocks ) {
                if (block == null) {
                    console.log('For some reason the block is null');
                    continue;
                }

                const blockNumberToTransaction = 
                    {block_number: block.number, transaction_hashes: block.transactions};

                exportList.push(blockNumberToTransaction);
            }

            return exportList;
        };

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();
        const tracker = new TrackerExportTransactions();
        const progressTracker = 
            new TransactionsExporterProgressTracker(tracker);

        this.exporter.export(
            progressTracker,
            web3.eth.getBlock.request,
            processWeb3Data
        );
    }

}
module.exports = TransactionsExporter;