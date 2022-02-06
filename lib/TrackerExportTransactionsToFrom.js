const Tracker = require('./Tracker');

class TrackerExportTransactionsToFrom extends Tracker {
    constructor() {
        super();
        console.log('ExportTransactionsToFrom Created');
    }

    getStartBlockNumber() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactionsToFrom.StartBlockNumber;
    }

    getEndBlockNumber() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactionsToFrom.EndBlockNumber;
    }

    update(endBlockNumber) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactionsToFrom.EndBlockNumber = endBlockNumber
        };
        this.__update(updateTrackerDocumentClosure);
    }
}
module.exports = TrackerExportTransactionsToFrom;