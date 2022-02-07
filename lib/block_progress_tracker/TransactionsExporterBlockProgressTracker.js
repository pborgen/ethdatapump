const BlockProgressTracker = require("./BlockProgressTracker");


class TransactionsExporterBlockProgressTracker extends BlockProgressTracker{

    constructor(tracker) { 
        super(tracker);
    }

    getCurrentWeb3MethodParamter() {
        return this.getCurrentBlockNumber();
    }

}

module.exports = TransactionsExporterBlockProgressTracker;