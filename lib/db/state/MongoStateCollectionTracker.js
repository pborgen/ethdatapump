
//const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PropertiesSingleton = require('../../PropertiesSingleton');
const MongoStateCollection = require('./MongoStateCollection');
const MongoTransactionCollection = require('../MongoTransactionCollection');
const Mongo = require('../Mongo');
const Helper = require('../../helper/Helper');
const uuid = require("uuid");
const { ConnectionClosedEvent } = require('mongodb');



class MongoStateCollectionTracker {

    constructor() { 
        this.properties = PropertiesSingleton;
        this.mongoStateCollection = new MongoStateCollection();
        this.mongoTransactionCollection = new MongoTransactionCollection();
        this.mongo = new Mongo();
        this.helper = new Helper();
    }

    async update(blocksProcessed) {
        const key = uuid.v4();
        try {   
            await this.getLock(key);
            
            let document = await this.__getTransactionTrackerDocument();

            let blocksCurrentlyBeingProcessed = document.blocksCurrentlyBeingProcessed;
            if (blocksCurrentlyBeingProcessed === undefined) {
                blocksCurrentlyBeingProcessed = [];
            }

            for(let x = 0; x < blocksProcessed.length; x++) {
                let element = blocksProcessed[x];
                blocksCurrentlyBeingProcessed = 
                    blocksCurrentlyBeingProcessed.filter(item => item !== element);
            }

            const closure = async function(db) {
                const collection = db.collection("tracker");
                document.blocksCurrentlyBeingProcessed = blocksCurrentlyBeingProcessed;
                document.lastBlockProcessed = Math.max(...blocksProcessed);

                await collection.replaceOne(
                    {name: "tracker_transactions"}, 
                    document
                );
            };

            await this.mongo.execute(closure, "state");
        } catch(e) {
            console.log("Failed: " + e);
        } finally {
            await this.releaseLock(key);
        }
    }

    async getNextTransactions(numberOfDistinctBlockToProcess = 10) {
        let returnValue = null;

        const key = uuid.v4();
        
        let lastBlockProcessed = null;
        let blocksCurrentlyBeingProcessed = null;
        let nextBlocksToProcess = [];

        try {
            await this.__forceReleaseLock();
            await this.getLock(key);
            let document = await this.__getTransactionTrackerDocument();

            blocksCurrentlyBeingProcessed = document.blocksCurrentlyBeingProcessed;
            if (blocksCurrentlyBeingProcessed === undefined) {
                blocksCurrentlyBeingProcessed = [];
            }

            lastBlockProcessed = document.lastBlockProcessed;

            let blockNumber = lastBlockProcessed + 1;
            while(true) {
                
                let blockAlreadyBeingProcessed = blocksCurrentlyBeingProcessed.includes(blockNumber);
                if (!blockAlreadyBeingProcessed) {
                    //Check if block exists in the transactions collection
                    if(await this.mongoTransactionCollection.doesBlockExist(blockNumber)) {
                        nextBlocksToProcess.push(blockNumber);
                    } else {
                        console.log("Block does not have transactions: BlockNumber: " + blockNumber);
                    }
                }

                if (nextBlocksToProcess.length >= numberOfDistinctBlockToProcess ) {
                    break;
                }

                blockNumber++;
            }

            
            let allBlocksCurrentlyBeingProcessed = 
                blocksCurrentlyBeingProcessed.concat(nextBlocksToProcess).sort();

            await this.__updateBlocksCurrentlyBeingProcessed(
                allBlocksCurrentlyBeingProcessed
            );

            returnValue = this.mongoTransactionCollection.getTransactions(nextBlocksToProcess);

        } catch(e) {
            console.log("Failed in getNextBlocksToProcess: " + e);
        } finally {
            await this.releaseLock(key);
        }

        return returnValue;
    }

    async getNextBlocksToProcess(numberOfDistinctBlockToProcess = 1) {
        const key = uuid.v4();
        
        let lastBlockProcessed = null;
        let blocksCurrentlyBeingProcessed = null;
        let nextBlocksToProcess = [];
        try {
            await this.__forceReleaseLock();
            await this.getLock(key);
            let document = await this.__getTransactionTrackerDocument();

            blocksCurrentlyBeingProcessed = document.blocksCurrentlyBeingProcessed;
            if (blocksCurrentlyBeingProcessed === undefined) {
                blocksCurrentlyBeingProcessed = [];
            }

            lastBlockProcessed = document.lastBlockProcessed;

            let blockNumber = lastBlockProcessed + 1;
            while(true) {
                
                let blockAlreadyBeingProcessed = blocksCurrentlyBeingProcessed.includes(blockNumber);
                if (!blockAlreadyBeingProcessed) {
                    nextBlocksToProcess.push(blockNumber);
                }

                if (nextBlocksToProcess.length >= numberOfDistinctBlockToProcess ) {
                    break;
                }

                blockNumber++;
            }

            
            let allBlocksCurrentlyBeingProcessed = 
                blocksCurrentlyBeingProcessed.concat(nextBlocksToProcess).sort();

            await this.__updateBlocksCurrentlyBeingProcessed(
                allBlocksCurrentlyBeingProcessed
            );

        } catch(e) {
            console.log("Failed in getNextBlocksToProcess: " + e);
        } finally {
            await this.releaseLock(key);
        }

        return nextBlocksToProcess;
    }

    /**
     * 
     * @param {string} Used to ensure that the lock can only be unllocked by someone with the key
     */
     async getLock(key) {
        const closure = async function(db) {
            let ableToGetTheLock = false;

            const collection = db.collection("tracker");

            let result = 
                await collection.findOneAndUpdate(
                    {name: "tracker_transactions", status: "available"}, 
                    {$set: {"status": "locked", "lock_key": key}}
                );
            
            // If we got a value we know we were able to get the lock
            if (result === null || result.value === null) {
                ableToGetTheLock = false;
            } else {
                ableToGetTheLock = true;
            }

            return ableToGetTheLock;
        }

        let weGotTheLock = false;

        while(!weGotTheLock) {
            weGotTheLock = await this.mongo.execute(closure, "state");
            this.helper.sleep(1000);
        }  
    }

    async __getTransactionTrackerDocument() {
        const closure = async function(db) {
            const collection = db.collection("tracker");
            const document = 
                await collection
                    .findOne({name: "tracker_transactions"});
                    
            return document;
        };

        return await this.mongo.execute(closure, "state");
    }

    async __updateBlocksCurrentlyBeingProcessed(blocksCurrentlyBeingProcessed) {
        const closure = async function(db) {
            const collection = db.collection("tracker");
            await collection
                .updateOne(
                    {name: "tracker_transactions"}, 
                    {$set: {"blocksCurrentlyBeingProcessed": blocksCurrentlyBeingProcessed}}
                );
        };

        return await this.mongo.execute(closure, "state");
    }

    /**
     * 
     * @param {string} Used to ensure that the lock can only be unllocked by someone with the key
     */
     async releaseLock(key) {
        const closure = async function(db) {
            let ableToGetTheLock = false;

            const collection = db.collection("tracker");

            let result = 
                await collection.findOneAndUpdate(
                    {name: "tracker_transactions", status: "locked", "lock_key": key}, 
                    {$set: {"status": "available", "lock_key": ""}}
                );
            
            // If we got a value we know we were able to get the lock
            if (result === null || result.value === null) {
                ableToGetTheLock = false;
            } else {
                ableToGetTheLock = true;
            }

            return ableToGetTheLock;
        }

        let weGotTheLock = false;

        while(!weGotTheLock) {
            weGotTheLock = await this.mongo.execute(closure, "state");
            this.helper.sleep(1000);
        }  
    }

    async __forceReleaseLock() {
        const closure = async function(db) {

            const collection = db.collection("tracker");

            await collection.updateOne(
                    {name: "tracker_transactions", status: "locked"}, 
                    {$set: {"status": "available", "lock_key": ""}}
            );
            
        }

        await this.mongo.execute(closure, "state");
       
    }

}

module.exports = MongoStateCollectionTracker;