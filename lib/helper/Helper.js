const fs = require('fs');
class Helper {

    constructor() { 
        
    }

    sleep(milliseconds) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < milliseconds);
    }

    getAllFileNamesInDirectory(directory) {
        return fs.readdirSync(directory);
    }

    makeDirectory(directory) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }
    }

    deleteDirectory(directory) {
        if (fs.existsSync(directory)) {
            fs.rmSync(directory, { recursive: true, force: true });
        }
    }

    parseFileNameGetEndBlockNumber(fileName) {
        const indexEndBlockCharaters = '_end_block_';
        const indexOfEndBlock = fileName.indexOf(indexEndBlockCharaters);
        const endBlockString = fileName.substring(indexOfEndBlock + indexEndBlockCharaters.length);
        const endBlockInt = parseInt(endBlockString);
        return endBlockInt;
    }

    parseFileNameGetStartBlockNumber(fileName) {
        const indexStartBlockCharaters = '_start_block_';
        const indexOfStartBlock = fileName.indexOf(indexStartBlockCharaters);
        const startBlockString = fileName.substring(indexOfStartBlock + indexStartBlockCharaters.length);
        const startBlockInt = parseInt(startBlockString);

        return startBlockInt;
    }
}

module.exports = Helper;