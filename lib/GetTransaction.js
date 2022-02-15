const http = require('http');
const net = require('net');
const fs = require('fs');

const PromisifyBatchRequest = require('./PromisifyBatchRequest');
const PropertiesSingleton = require('../lib/PropertiesSingleton');
const Web3ConnectionCreator = require('./Web3ConnectionCreator');
const CsvWriter = require('./CsvWriter');

class GetTransaction {
    constructor() {
        console.log('GetTransaction Created')

        this.properties = PropertiesSingleton;
    }

    export (transactionHash) {
        const web3ConnectionCreator = new Web3ConnectionCreator();
        let web3 = web3ConnectionCreator.create();

        web3.eth.getTransaction(transactionHash)
            .then(console.log);
    }

}
module.exports = GetTransaction;