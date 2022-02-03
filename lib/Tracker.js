const http = require('http');
const net = require('net');
const fs = require('fs');

const PromisifyBatchRequest = require('./PromisifyBatchRequest');
const Properties = require('../lib/Properties');
const Web3ConnectionCreator = require('./Web3ConnectionCreator');
const CsvWriter = require('./CsvWriter');
const CsvReader = require('./helper/CsvReader');

class Tracker {
    constructor() {
        console.log('Tracker Created')

        this.properties = new Properties();
        
    }

    update () {
        const trackerYamlFullPath = this.properties.getTrackerYamlFullPath();

        let doc = yaml.safeLoad(fs.readFileSync(trackerYamlFullPath, 'utf8'));
        doc.General.Greeting = newGreet;
        
        fs.writeFile(trackerYamlFullPath, yaml.safeDump(doc), (err) => {
            if (err) {
                console.log(err);
            }
        });

    }
}
module.exports = Tracker;