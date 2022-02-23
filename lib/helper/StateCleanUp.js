
const fs = require('fs');
const PropertiesSingleton = require('../PropertiesSingleton');
const Helper = require('./Helper');

class StateCleanup {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.helper = new Helper();

        this.cleanStateDirectory = this.properties.getCleanStateDirectory();

        this.cleanFileName = "I_AM.Clean";
        this.notCleanFileName = "Not.Clean";

        this.cleanFileFullPath = this.cleanStateDirectory  + "/" + this.cleanFileName;
        this.notCleanFileFullPath = this.cleanStateDirectory  + "/" + this.notCleanFileName;
    }

    isClean() {
        let returnValue = false;

        if (fs.existsSync(this.cleanFileFullPath)) {
            returnValue = true;
        }

        return returnValue;
    }

    blockUntillClean() {
        while (!this.isClean()) {
            console.log("Blocking Untill we have a clean state");
            this.helper.sleep(2000);
        }

        return this.isClean();
    }

    clean() {
        console.log("Start Clean");

        // Mark that the state is not clean on disk
        this.helper.deleteDirectory(this.cleanStateDirectory);
        this.helper.makeDirectory(this.cleanStateDirectory);
        fs.writeFileSync(this.notCleanFileFullPath, '');

        // Delete all locks
        const lockDirectory = this.properties.getLockDirectory();
        this.helper.deleteDirectory(lockDirectory);
    
        // Move files from processing back to preprocessing
        const transactionsProcessingDirectory = 
            this.properties.getExportDirectoryForProcessingTransactions();
        const fileNamesInTransactionsProcessingDirectory = 
            this.helper.getAllFileNamesInDirectory(transactionsProcessingDirectory);

        fileNamesInTransactionsProcessingDirectory.forEach(element => {
            fs.renameSync(
                transactionsProcessingDirectory + '/' + element,
                this.properties.getExportDirectoryForTransactions() + '/' + element
            );
        });

        fs.unlinkSync(this.notCleanFileFullPath);
        fs.writeFileSync(this.cleanFileFullPath, '');

        console.log("Clean Complete!!!");
    }
}

module.exports = StateCleanup;