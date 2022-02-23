const Tracker = require('./Tracker');

class TrackerExportTransactions extends Tracker {
    constructor() {
        super();
        console.log('TrackerExportTransactions Created');
    }

    getLastBlockProcessed() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactions.LastBlockProcessed;
    }

    update(lastBlockProcessed) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactions.LastBlockProcessed = lastBlockProcessed
        };
        this.__update(updateTrackerDocumentClosure);
    }
}
module.exports = TrackerExportTransactions;