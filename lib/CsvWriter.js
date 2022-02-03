
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

class CsvWriter {

    constructor() { 
        
    }

    write(tuple_list, header_list, full_path) {
        const csvWriter = createCsvWriter({
            path: full_path,
            header: header_list
        });
    
        csvWriter
            .writeRecords(tuple_list)
            .then(()=> {
                console.log('The CSV file ' + full_path + ' was written successfully')
            })
            .catch((error) => {
                console.error(error);
                console.error('Error writing this file to disk. File:' + full_path);
            });
    }


}

module.exports = CsvWriter;