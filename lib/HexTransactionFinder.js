
var fs = require('fs'); 
var parse = require('csv-parse');


class HexTransactionFinder {

    constructor(web3) { 
        this.batch = new web3.BatchRequest;
        this.requests = [];
    }

    findFromCsv(fullPathCsv) {
        var parser = parse({columns: true}, function (err, records) {
            console.log(records);
        });

        fs.createReadStream(fullPathCsv).pipe(parser);
    }
}

module.exports = HexTransactionFinder;