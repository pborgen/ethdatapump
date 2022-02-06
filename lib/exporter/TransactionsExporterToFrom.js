const Properties = require('../Properties');
const Web3ConnectionCreator = require('../Web3ConnectionCreator');
const Exporter = require('./Exporter');
const TrackerExportTransactionsToFrom = require('../TrackerExportTransactionsToFrom');

class TransactionsExporterToFrom {
    constructor() {
        console.log('TransactionsExporterToFrom Created')

        this.exporter = new Exporter();
        this.properties = new Properties();
    }

    export() {

        const header = [
            {id: 'block_number', title: 'block_number'},
            {id: 'transaction_number', title: 'transaction_number'},
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
                        transaction_number: transactionNumber,
                        to: transaction.to,
                        from: transaction.from
                    };
                    exportList.push(transactionsToAndFrom);
            }

            return exportList;
        };

        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();

        this.exporter.export(
            new TrackerExportTransactionsToFrom(), 
            header, 
            web3.eth.getBlock.request,
            processWeb3Data,
            this.properties.getExportDirectoryForTransactionsToFrom()
        );
    }

}
module.exports = TransactionsExporterToFrom;