const PropertiesSingleton = require("../PropertiesSingleton");


class ProgressTracker {

    __currentBlockNumber = null;
    __startBlockNumber = null;
    __endBlockNumber = null;
    __listToExport = [];

    constructor(tracker) { 
        this.properties = PropertiesSingleton;
        this.tracker = tracker;
        this.__startBlockNumber = this.tracker.getStartBlockNumber();
    }

    getTracker() {
        return this.tracker;
    }
    setListToExport(listToExport) {
        this.__listToExport = listToExport;
    }

    getListToExport() {
        return this.__listToExport;
    }

    update(currentBlockNumber, endBlockNumber) {
        this.__currentBlockNumber = currentBlockNumber;
        this.__endBlockNumber = endBlockNumber;
    }

    updateState() {
        return
    }

    shouldWriteToDisk() {
        return null;
    }

    getParameterFromObject(object) {
        return null;
    }

    shouldWriteToDisk() {
        const listToExportLength = this.getListToExport().length;
        return listToExportLength > this.maxCsvRowCount();
    }

    isComplete() {
        return  this.__currentBlockNumber >= this.__endBlockNumber;
    }

    getStartBlockNumber() {
        return this.__startBlockNumber;
    }

    setEndBlockNumber(endBlockNumber) {
        this.__endBlockNumber = endBlockNumber;
    }

    setCurrentBlockNumber(blockNumber) {
        this.__currentBlockNumber = blockNumber;
    }

    getEndBlockNumber() {
        return this.__endBlockNumber;
    }

    getCurrentBlockNumber() {
        return this.__currentBlockNumber;
    }

    maxCsvRowCount() {
        return 1000000;
    }

    getBatchSize() {
        return 500;
    }

    getFileLabel() {
        return "DefaultFileLable";
    }
}

module.exports = ProgressTracker;