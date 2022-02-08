const Tracker = require('../lib/Tracker');

class TrackerExportTransactions extends Tracker {
    constructor() {
        super();
        console.log('TrackerExportTransactions Created');
    }

    getStartBlockNumber() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactions.StartBlockNumber;
    }

    getEndBlockNumber() {
        const trackerYaml = this.__getTrackerYaml();

        return trackerYaml.ExportTransactions.EndBlockNumber;
    }

    update(endBlockNumber) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactions.StartBlockNumber = endBlockNumber
            trackerDocument.ExportTransactions.EndBlockNumber = endBlockNumber;
        };
        this.__update(updateTrackerDocumentClosure);
    }
}
module.exports = TrackerExportTransactions;