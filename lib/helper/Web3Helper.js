
const Web3ConnectionCreator = require('../Web3ConnectionCreator');

class Web3Helper {

    constructor() { 
        const web3ConnectionCreator = new Web3ConnectionCreator();
        this.web3 = web3ConnectionCreator.create();
    }

    latestBlockNumber_NOTWORKING() {
        let latestBlockNumber = null;
        let bla = (async (latestBlockNumber) => {
            latestBlockNumber = await this.web3.eth.getBlockNumber();
         })();
        return latestBlockNumber
    }
}

module.exports = Web3Helper;