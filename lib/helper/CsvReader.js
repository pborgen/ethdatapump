
const fs = require('fs');
const parse = require('csv-parse');

class CsvReader {

    constructor() { 
        
    }

    read(full_path, headers_in_order, shouldLog=false) {
        const data = fs.readFileSync(
            full_path,
            {encoding:'utf-8', flag:'r'}
        );

        if (shouldLog) {
            console.log(data);
        }
        
        let returnValue = [];
        let counter = 0;
        const lines = data.split(/\r?\n/);
        
        for (const line of lines) {
            
            let isLineEmpty = !line.length;
            if (isLineEmpty) {
                 continue;
            }

            //skip the first line because that is the header
            if (counter != 0) {
                const split = line.split(',');
                let valueTuple = {};

                let headerCounter = 0;
                for (const headerName of headers_in_order) {
                    
                    if (headerName == 'block_number') {
                        valueTuple[headerName] = parseInt(split[headerCounter]);
                    } else {
                        valueTuple[headerName] = split[headerCounter];
                    }

                    headerCounter++;
                }
                
                returnValue.push(valueTuple);
            }
            
            counter++;   
        }
        
        return returnValue;            
    }
}

module.exports = CsvReader;