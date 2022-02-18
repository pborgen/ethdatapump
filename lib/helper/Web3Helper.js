
const PropertiesSingleton = require('../PropertiesSingleton');

class Web3Helper {

    constructor() { 
        this.properties = PropertiesSingleton;
    }

     latestBlockNumber() {
        const execSync = require('child_process').execSync;
        const gethFullPath = this.properties.getGethFullPath();
        const dataDirectory = this.properties.getDataDirectory();

        let returnValue = 
            execSync(
                `${gethFullPath} --datadir ${dataDirectory} attach --exec "eth.blockNumber"`,
                { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 }
            );

        return parseInt(returnValue.trim());
    }
}

module.exports = Web3Helper;