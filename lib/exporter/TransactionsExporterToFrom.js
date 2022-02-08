const Properties = require('../Properties');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const Exporter = require('./Exporter');
const TrackerExportTransactionsToFrom = require('../TrackerExportTransactionsToFrom');
const TransactionsExporterFromToAddressBlockProgressTracker = 
    require('../block_progress_tracker/TransactionsExporterFromToAddressBlockProgressTracker')
class TransactionsExporterToFrom {
    constructor() {
        console.log('TransactionsExporterToFrom Created')

        this.exporter = new Exporter();
        this.properties = new Properties();
    }

    export() {

        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_hash', title: 'transaction_hash'},
            {id: 'to', title: 'to'},
            {id: 'from', title: 'from'},
        ];

        const processWeb3Data = function(transactions) {
            let exportList = [];

            for (let transaction of transactions ) {
                if (transaction == null) {
                    console.log('For some reason the transaction is null');
                    continue;
                }
                let blockNumber = transaction.blockNumber;
                        
                let transactionsToAndFrom = 
                    {
                        block_number: blockNumber, 
                        transaction_hash: transaction.hash,
                        to: transaction.to,
                        from: transaction.from
                    };
                    exportList.push(transactionsToAndFrom);
            }

            return exportList;
        };

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();

        const tracker = new TrackerExportTransactionsToFrom();

        const blockProgressTracker = 
            new TransactionsExporterFromToAddressBlockProgressTracker(tracker);
        
        this.exporter.export(
            tracker, 
            blockProgressTracker,
            header, 
            web3.eth.getTransaction.request,
            processWeb3Data,
            this.properties.getExportDirectoryForTransactionsToFrom()
        );
    }

}
module.exports = TransactionsExporterToFrom;