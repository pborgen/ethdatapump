
const PropertiesSingleton = require('../PropertiesSingleton');
const SSHHelper = require('../helper/SSHHelper');
class Web3Helper {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.sshHelper = new SSHHelper();
    }

     latestBlockNumber() {
        const execSync = require('child_process').execSync;
        const gethFullPath = this.properties.getGethFullPath();
        const dataDirectory = this.properties.getDataDirectory();

        let returnValue = this.sshHelper.executeCommandWithReturnValue(
            `${gethFullPath} --datadir ${dataDirectory} attach --exec "eth.blockNumber"`
        );

        let lastestBlockNumber = parseInt(returnValue.trim());

        console.log("Latest Block Number is " + lastestBlockNumber);
        
        return latestBlockNumber;
    }
}

module.exports = Web3Helper;