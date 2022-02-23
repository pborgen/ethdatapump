const Tracker = require('./Tracker');

class TrackerExportTransactionsToFrom extends Tracker {
    constructor() {
        super();
        console.log('ExportTransactionsToFrom Created');
    }

    getLastBlockProcessed() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactionsToFrom.LastBlockProcessed;
    }

    update(endBlockNumber) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactionsToFrom.StartBlockNumber = endBlockNumber
            trackerDocument.ExportTransactionsToFrom.EndBlockNumber = endBlockNumber
        };
        this.__update(updateTrackerDocumentClosure);
    }
}
module.exports = TrackerExportTransactionsToFrom;