const fs = require('fs'); 
const yaml = require('js-yaml');

class Properties {

    constructor() { 
        this.properties = yaml.load(fs.readFileSync(__dirname + '/config/base_configuration.yaml', 'utf8'));
    }

    getTrackerYamlFullPath() {
        return __dirname + '/config/tracker.yaml'
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