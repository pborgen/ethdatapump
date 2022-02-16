const ProgressTracker = require("./ProgressTracker");


class TransactionsExporterProgressTracker extends ProgressTracker {

    constructor(tracker) { 
        super(tracker);
    }

    getCurrentObject() {
        return this.getCurrentBlockNumber();
    }

    getParameterFromObject(blockNumber) {
        return blockNumber;
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

module.exports = TransactionsExporterProgressTracker;