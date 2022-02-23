const PropertiesSingleton = require('../PropertiesSingleton');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const Exporter = require('./Exporter');
const TrackerExportTransactionsToFrom = require('../tracker/TrackerExportTransactionsToFrom');
const TransactionsExporterFromToAddressProgressTracker = 
    require('../block_progress_tracker/TransactionsExporterFromToAddressProgressTracker')
class TransactionsExporterToFrom {
    constructor() {
        console.log('TransactionsExporterToFrom Created')

        this.exporter = new Exporter();
        this.properties = PropertiesSingleton;
    }

    export() {

        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_hash', title: 'transaction_hash'},
            {id: 'from', title: 'from'},
            {id: 'to', title: 'to'},
            
        ];

        const objectToString = function(object) {

            const objectAsString = 
                object.block_number + ',' + 
                object.transaction_hash + ',' + 
                object.from + ',' + 
                object.to

            return objectAsString;
        }

        const processWeb3Data = function(transactions) {
            let exportList = [];

            for (let transaction of transactions) {

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

        const progressTracker = 
            new TransactionsExporterFromToAddressProgressTracker(tracker);
        
        this.exporter.export(
            progressTracker,
            header, 
            web3.eth.getTransaction.request,
            processWeb3Data,
            objectToString,
            this.properties.getExportDirectoryForTransactionsToFrom()
        );
    }

}
module.exports = TransactionsExporterToFrom;