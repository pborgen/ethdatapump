

class BlockProgressTracker {

    __currentBlockNumber = null;
    __startBlockNumber = null;
    __endBlockNumber = null;

    constructor(tracker) { 
        this.tracker = tracker;
        this.__startBlockNumber = this.tracker.getEndBlockNumber() + 1;
    }

    update(currentBlockNumber, endBlockNumber) {
        this.__currentBlockNumber = currentBlockNumber;
        this.__endBlockNumber = endBlockNumber;
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
        if (this.__currentBlockNumber == null) {
            this.__currentBlockNumber = this.getStartBlockNumber();
        }

        return this.__currentBlockNumber;
    }
}

module.exports = BlockProgressTracker;