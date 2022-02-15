
//const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PropertiesSingleton = require('./PropertiesSingleton');
const fs = require('fs'); 

class CsvWriter {

    constructor() { 
        this.properties = PropertiesSingleton;
    }

    write(objectList, headerList, fullPath, objectToStringClosure) {

        // get header
        let headerString = "";
        for (let x = 0; x < headerList.length; x++) {
            let columnName = headerList[x].title;
            headerString += columnName + ',';
        }
        // trim trailing comma
        headerString = headerString.substring(0, headerString.length - 1);

        const file = fs.openSync(fullPath, 'w');

        // Write Header
        fs.writeSync(file, headerString + '\r\n');

        let rowCache = "";
        let itemsInCache = 0;
        const cacheSize = this.properties.getCsvWriter().number_rows_to_cache_before_writing_to_disk;

        for (let x = 0; x < objectList.length; x++) {
            let object = objectList[x];
            let row = objectToStringClosure(object);
            
            rowCache += row + '\r\n';
            itemsInCache++;

            if(itemsInCache >= cacheSize) {
                fs.writeSync(file, rowCache);
                rowCache = "";
                itemsInCache = 0;
            }
        }

        if(itemsInCache > 0) {
            fs.writeSync(file, rowCache);
            rowCache = "";
            itemsInCache = 0;
        }

        console.log('Complete writing the follow file to disk - ' + fullPath);
        // const csvWriter = createCsvWriter({
        //     path: fullPath,
        //     header: headerList
        // });
    
        // await csvWriter
        //     .writeRecords(tupleList)
        //     .then(()=> {
        //         console.log('The CSV file ' + full_path + ' was written successfully')
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //         console.error('Error writing this file to disk. File:' + full_path);
        //     });
    }


}

module.exports = CsvWriter;