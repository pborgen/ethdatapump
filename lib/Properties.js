var fs = require('fs'); 
const yaml = require('js-yaml');

class Properties {

    constructor() { 
        this.properties = yaml.load(fs.readFileSync(__dirname + '/config/base_configuration.yaml', 'utf8'));
    }

    getWeb3Url() {
        return this.properties.conneciton.web3Url;
    }

    getExportDirectory() {
        return this.properties.export_directory;
    }

    isIpcConnection() {
        return this.properties.connection.is_ipc_connection;
    }

    getIpcFullPath() {
        return this.properties.connection.ipc_full_path;
    }

    getBatchSize() {
        return this.properties.performance.batch_size;
    }
}

module.exports = Properties;