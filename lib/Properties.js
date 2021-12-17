var fs = require('fs'); 
const yaml = require('js-yaml');

class Properties {

    constructor() { 
        this.properties = yaml.load(fs.readFileSync(__dirname + '/config/base_configuration.yaml', 'utf8'));
    }

    getWeb3Url() {
        return this.properties.web3Url;
    }

    getExportDirectory() {
        return this.properties.export_directory;
    }
}

module.exports = Properties;