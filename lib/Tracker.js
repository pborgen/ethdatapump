const fs = require('fs');
const yaml = require('js-yaml');

const Properties = require('../lib/Properties');


class Tracker {
    constructor() {;
        console.log('Tracker Created')

        this.properties = new Properties();
        this.trackerYamlFullPath = this.properties.getTrackerYamlFullPath();  
    }

    updateExportTransactionsTracker(startBlockNumber, endBlockNumber) {
        const updateTrackerDocumentClosure = function(trackerDocument) {
            trackerDocument.ExportTransactions.StartBlock = startBlockNumber;
            trackerDocument.ExportTransactions.EndBlock = endBlockNumber
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