const TransactionsExporterToFrom = require('../lib/exporter/TransactionsExporterToFrom');
const properties = require('../lib/PropertiesSingleton');
const fs = require('fs-extra') 

let main = function() {
    fs.rmSync('/mnt/crypto/export/test', { recursive: true });

    // Copy test set files
    fs.copySync(__dirname + '/test_sets/1', '/mnt/crypto/export/test')
    
    properties.setupForTest('/mnt/crypto/export/test/config');

    let transactionsExporterToFrom = new TransactionsExporterToFrom();
    transactionsExporterToFrom.export();
}


main()