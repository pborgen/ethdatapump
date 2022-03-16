const http = require('http');
const Web3 = require('web3');
const net = require('net');
const PropertiesSingleton = require('./PropertiesSingleton');

class Web3ConnectionCreator {

    constructor() { 
        this.properties = PropertiesSingleton;
    }

    create() {
        let web3 = null;

        if(this.properties.isIpcConnection()) {
            const ipc_full_path = this.properties.getIpcFullPath();

            web3 = new Web3(new Web3.providers.IpcProvider(ipc_full_path, net));
        } else if(this.properties.isWebSocketConnection()) {
            web3 = 
                new Web3(
                    new Web3.providers.WebsocketProvider(
                        this.properties.getConnection().web_socket_url
                    )
                );

        } else {
            web3 = new Web3(this.properties.getConnection().web3Url, net);
        }

        return web3;
    }

}

module.exports = Web3ConnectionCreator;