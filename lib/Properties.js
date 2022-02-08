const fs = require('fs'); 
const yaml = require('js-yaml');

class Properties {

    constructor() { 
        let propertiesFullPath = __dirname + '/config/base_configuration.yaml';

        const areWeRunningInDocker = process.env.IS_DOCKER;
        if (areWeRunningInDocker) {
            console.log('Setting base_configuration.yaml path because we are running in docker');
            propertiesFullPath = '/mnt/crypto/export/config/base_configuration.yaml';
        }

        this.properties = yaml.load(fs.readFileSync(propertiesFullPath, 'utf8'));
    }

    getTrackerYamlFullPath() {
        let trackerFullPath = __dirname + '/config/tracker.yaml';

        const areWeRunningInDocker = process.env.IS_DOCKER;

        if (areWeRunningInDocker) {
            console.log('Setting tracker.yaml path because we are running in docker');
            trackerFullPath = '/mnt/crypto/export/config/tracker.yaml';
        }

        return trackerFullPath;
    }

    getWeb3Url() {
        return this.properties.conneciton.web3Url;
    }

    getExportDirectory() {
        return this.properties.export_directory;
    }

    getExportDirectoryForTransactions() {
        return this.properties.export_directory + "/transactions";
    }

    getExportDirectoryForProcessedTransactions() {
        return this.properties.export_directory + "/transactions/processed";
    }

    getExportDirectoryForTransactionsToFrom() {
        return this.properties.export_directory + "/transactionsToFrom";
    }

    isIpcConnection() {
        return this.properties.connection.is_ipc_connection;
    }

    getIpcFullPath() {
        return this.properties.connection.ipc_full_path;
    }

    getExportTransactionsPerformanceConfiguration() {
        return this.properties.performance.export_transactions;
    }

    getExportTransactionsFromToPerformanceConfiguration() {
        return this.properties.performance.export_transactions_from_to;
    }
}

module.exports = Properties;