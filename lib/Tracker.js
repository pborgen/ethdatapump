const fs = require('fs');
const yaml = require('js-yaml');

const PropertiesSingleton = require('./PropertiesSingleton');


class Tracker {
    constructor() {;
        console.log('Tracker Created')

        this.properties = PropertiesSingleton;
        this.trackerYamlFullPath = this.properties.getTrackerYamlFullPath();  
    }

    updateExportTransactionsTracker(lastBlockProcessed) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactions.LastBlockProcessed = lastBlockProcessed;
        };
        this.__update(updateTrackerDocumentClosure);
    }

    updateExportTransactionsFromToAddressTracker(startBlockNumber, endBlockNumber) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactionsFromToAddress.StartBlockNumber = startBlockNumber;
            trackerDocument.ExportTransactionsFromToAddress.EndBlockNumber = endBlockNumber
        };
        this.__update(updateTrackerDocumentClosure);
    }

    __update(updateTrackerDocumentClosure) {
        
        let trackerDocument = this.__getTrackerYaml();

        updateTrackerDocumentClosure(trackerDocument);
        
        this.__updateTrackerYaml(trackerDocument);

    }
    __getTrackerYaml() {
        const yamlFile = fs.readFileSync(this.trackerYamlFullPath, 'utf8');

        return yaml.load(yamlFile);
    }

    __updateTrackerYaml(trackerDocument) {
        let yamlDumped = yaml.dump(trackerDocument);

        fs.writeFileSync(this.trackerYamlFullPath, yamlDumped, 'utf8');
    }
}
module.exports = Tracker;