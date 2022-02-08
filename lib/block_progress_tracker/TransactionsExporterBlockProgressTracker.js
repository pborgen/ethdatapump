const BlockProgressTracker = require("./BlockProgressTracker");


class TransactionsExporterBlockProgressTracker extends BlockProgressTracker{

    constructor(tracker) { 
        super(tracker);
    }

    getCurrentWeb3MethodParamter() {
        return this.getCurrentBlockNumber();
    }

    getFileLabel() {
        return "block_number_with_transactions_file_start_block_";
    }

    getBatchSize() {
        return this.properties.getExportTransactionsPerformanceConfiguration().web3_batch_size;
    }

    maxCsvRowCount() {
        return this.properties.getExportTransactionsPerformanceConfiguration().csv_row_max_count;
    }

}

module.exports = TransactionsExporterBlockProgressTracker;