const PropertiesSingleton = require('../PropertiesSingleton');
const Helper = require('../helper/Helper');
const lockfile = require('proper-lockfile');

class LockHelper {

    constructor(nameOfLock) { 
        this.nameOfLock = nameOfLock;
        this.properties = PropertiesSingleton;
        this.helper = new Helper();
        this.releaseMethod = null;
    }

    lock() {
        const staleTimeOut = 99999999;
        const lockConfig = {stale: staleTimeOut};

        // Start - Creat a lock
        const lockDirectory = this.properties.getLockDirectory();
        const lockFilePath = lockDirectory + '' + this.nameOfLock;

        if (!fs.existsSync(lockDirectory)) {
            fs.mkdirSync(lockDirectory, { recursive: true });
        }

        fs.writeFileSync(lockFilePath, '');

        // Wait untill we can get the lock
        let isLocked = lockfile.checkSync(lockFilePath, lockConfig);
        while (isLocked) {
            this.helper.sleep(10000);
            isLocked = lockfile.checkSync(lockFilePath, lockConfig);
        }

        this.releaseMethod = lockfile.lockSync(lockFilePath, lockConfig);
        // End - Create a lock
    }

    release() {
        this.releaseMethod();
    }
}

module.exports = LockHelper;