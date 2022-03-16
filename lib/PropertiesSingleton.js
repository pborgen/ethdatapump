const fs = require('fs'); 
const yaml = require('js-yaml');

class PropertiesSingleton {

    constructor() {
        this.baseConfigDirectory = __dirname + '/config';

        const areWeRunningInDocker = process.env.IS_DOCKER;
        if (areWeRunningInDocker) {
            console.log('Setting base_configuration.yaml path because we are running in docker');
            this.baseConfigDirectory = '/mnt/crypto/export/prod/config';
        }

        this.__init(this.baseConfigDirectory);
    }

    __init(baseConfigDirectory) {
        this.baseConfigDirectory = baseConfigDirectory;
        
        let propertiesFullPath = baseConfigDirectory + '/base_configuration.yaml';

        this.properties = yaml.load(fs.readFileSync(propertiesFullPath, 'utf8'));
    }

    setupForTest(baseConfigDirectoryForTest) {
        this.__init(baseConfigDirectoryForTest);
    }

    getLockFileFullPath() {
        return this.baseConfigDirectory + '/.lock';
    }

    getTrackerYamlFullPath() {
        return this.baseConfigDirectory + '/tracker.yaml';
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

    getExportDirectoryForProcessingTransactions() {
        return this.properties.export_directory + "/transactions/processing";
    }

    getExportDirectoryForProcessedTransactions() {
        return this.properties.export_directory + "/transactions/processed";
    }

    getExportDirectoryForTransactionsToFrom() {
        return this.properties.export_directory + "/transactionsToFrom";
    }

    getCleanStateDirectory() {
        return this.properties.export_directory + "/cleanState";
    }

    getLockDirectory() {
        return this.properties.lock_directory;
    }

    getConnection() {
        return this.properties.connection;
    }

    getDataDirectory() {
        return this.properties.connection.data_directory;
    }

    getGethFullPath() {
        return this.properties.connection.geth_full_path;
    }
    isWebSocketConnection() {
        return this.properties.connection.is_web_socket_connection;
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

    getCsvWriter() {
        return this.properties.csv_writer;
    }

    getMongoDB() {
        return this.properties.mongoDb;
    }

}

module.exports = new PropertiesSingleton();