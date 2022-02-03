
const CsvReadableStream = require('csv-reader');
const fs = require('fs');
const parse = require('csv-parse');
const finished = require('stream/promises');

class CsvReader {

    constructor() { 
        
    }

    read(full_path, headers_in_order) {
        const data = fs.readFileSync(
            full_path,
            {encoding:'utf-8', flag:'r'}
        );
        console.log(data);
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
                    
                    valueTuple[headerName] = split[headerCounter];

                    headerCounter++;
                }
                
                returnValue.push(valueTuple);
            }
            
            counter++;   
        }
        
            return returnValue;
        // var input = fs.readFileSync(full_path, 'utf8');
        // const records = parse(input, {
        //     columns: true,
        //     skip_empty_lines: true
        //   });

        // let inputStream = fs.createReadStream(full_path, 'utf8');

        // inputStream
        //     .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        //     .on('data', function (row) {
        //         console.log('A row arrived: ', row);
        //     })
        //     .on('end', function () {
        //         console.log('No more rows!');
        //     });
            
    }


}

module.exports = CsvReader;