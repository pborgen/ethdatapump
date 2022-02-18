const PropertiesSingleton = require("../PropertiesSingleton");


class ProgressTracker {

    __currentBlockNumberToBeProcessed = null;
    __lastBlockProcessed = null;
    __listToExport = [];

    constructor(tracker) { 
        this.properties = PropertiesSingleton;
        this.tracker = tracker;
        this.__lastBlockProcessed = this.tracker.getLastBlockProcessed();
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

    update(lastBlockProcessed) {
        this.__lastBlockProcessed = lastBlockProcessed;
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
        return  null;
    }

    getLastBlockProcessed() {
        return this.__lastBlockProcessed;
    }

    setLastBlockProcessed(lastBlockProcessed) {
        this.__lastBlockProcessed = lastBlockProcessed;
    }

    setCurrentBlockNumberToBeProcessed(blockNumber) {
        this.__currentBlockNumberToBeProcessed = blockNumber;
    }

    getCurrentBlockNumberToBeProcessed() {
        return this.__currentBlockNumberToBeProcessed;
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