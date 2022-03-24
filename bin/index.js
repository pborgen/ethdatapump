// #! /usr/bin/env node

// const program = require('commander');
// const GetTransaction = require('../lib/GetTransaction');
// const TransactionsExporterToFrom = require('../lib/exporter/TransactionsExporterToFrom');
// const TransactionsExporter = require('../lib/exporter/TransactionsExporter');

// const HexTransactionFinder = require('../lib/HexTransactionFinder');


// let Uniswap = require('../src/uniswap/Uniswap.ts');

// //import {Uniswap} from '../lib/uniswap/Uniswap' 

// const StateCleanUp = require('../lib/helper/StateCleanUp');
// const Mongo = require('../lib/db/Mongo');
// const MongoSetup = require('../lib/db/MongoSetup');
// const MongotransactionCollection = require('../lib/db/MongoTransactionCollection');

// program
//     .command('clean_state') // sub-command name
//     .description('clean state') // command description

//     // function to execute when command is uses
//     .action(function () {
//         console.log('About to Clean the state');
//         let stateCleanUp = new StateCleanUp();
//         stateCleanUp.clean();
//     });

// program
//     .command('mongo_setup') // sub-command name
//     .description('mongodb setup') // command description

//     // function to execute when command is uses
//     .action(function () {
//         console.log('Setting up Mongo DB');

//         new MongoSetup().setup();
//     });

// program
//     .command('export_transactions') // sub-command name
//     .alias('e') // alternative sub-command is `al`
//     .description('export transactions') // command description

//     // function to execute when command is uses
//     .action(function () {
//         console.log('About to run TransactionsExporter');

//         let stateCleanUp = new StateCleanUp();
//         stateCleanUp.blockUntillClean();
        

//         let transactionsExporter = new TransactionsExporter();

//         transactionsExporter.export();
//     });

// program
//     .command('export_transactions_from_to_address') // sub-command name
//     .description('export transactions from/to address') // command description

//     // function to execute when command is uses
//     .action(function () {
//         console.log('About to run TransactionsExporterToFrom');
//         let stateCleanUp = new StateCleanUp();
//         stateCleanUp.blockUntillClean();
        
//         let transactionsExporterToFrom = new TransactionsExporterToFrom();
//         transactionsExporterToFrom.export();
//     });

// program
//     .command('getTransaction') // sub-command name
//     .alias('et') 
//     .description('getTransaction') // command description

//     // function to execute when command is uses
//     .action(function () {
//         let getTransaction = new GetTransaction();
//         getTransaction.export('0xf449665bddefcaf3f2bebe7aa54b93cb5b3a30c3b4c04d498bdcf8b2edca4bdf');
//     });

// program
//     .command('find_hex_transactions') // sub-command name
//     .description('find_hex_transactions from csv') // command description

//     // function to execute when command is uses
//     .action(function () {
//         HexTransactionFinder('/mnt/crypto/block_number_with_transactions.js');
//     });

// program
//     .command('uniswap') // sub-command name
//     .description('uniswap') // command description

//     // function to execute when command is uses
//     .action(function () {
//         let bla = new Uniswap();
//         bla.greet();
//         //let uniswapHelper = new UniswapHelper();
//         //uniswapHelper.price();
//     });




// // allow commander to parse `process.argv`
// console.log('Arguments passed in: ' + process.argv)
// program.parse(process.argv);
