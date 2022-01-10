var http = require('http');
var Web3 = require('web3');
var net = require('net');
const Properties = require('../lib/Properties');

class Web3ConnectionCreator {

    constructor() { 
        this.Properties = new Properties();
    }

    create() {
        let web3 = null;

        if(this.Properties.isIpcConnection()) {
            const ipc_full_path = this.Properties.getIpcFullPath();

            web3 = new Web3(new Web3.providers.IpcProvider(ipc_full_path, net));
        } else {
            web3 = new Web3(web3_url, net);
        }

        return web3;
    }

}

module.exports = Web3ConnectionCreator;