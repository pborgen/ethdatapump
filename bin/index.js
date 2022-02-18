#! /usr/bin/env node

const program = require('commander');
const TransactionsExporter = require('../lib/exporter/TransactionsExporter');
const HexTransactionFinder = require('../lib/HexTransactionFinder');
const GetTransaction = require('../lib/GetTransaction');
const Tracker = require('../lib/Tracker');
const TransactionsExporterToFrom = require('../lib/exporter/TransactionsExporterToFrom');

program
    .command('export_transactions') // sub-command name
    .alias('e') // alternative sub-command is `al`
    .description('export transactions') // command description

    // function to execute when command is uses
    .action(function () {
        console.log('About to run TransactionsExporter');
        let transactionsExporter = new TransactionsExporter();

        transactionsExporter.export();
    });

program
    .command('export_transactions_from_to_address') // sub-command name
    .alias('eft') 
    .description('export transactions from/to address') // command description

    // function to execute when command is uses
    .action(function () {
        console.log('About to run TransactionsExporterToFrom');
        let transactionsExporterToFrom = new TransactionsExporterToFrom();
        transactionsExporterToFrom.export();
    });

program
    .command('getTransaction') // sub-command name
    .alias('et') 
    .description('getTransaction') // command description

    // function to execute when command is uses
    .action(function () {
        let getTransaction = new GetTransaction();
        getTransaction.export('0xf449665bddefcaf3f2bebe7aa54b93cb5b3a30c3b4c04d498bdcf8b2edca4bdf');
    });

program
    .command('find_hex_transactions') // sub-command name
    .description('find_hex_transactions from csv') // command description

    // function to execute when command is uses
    .action(function () {
        HexTransactionFinder('/mnt/crypto/block_number_with_transactions.js');
    });




// allow commander to parse `process.argv`
console.log('Arguments passed in: ' + process.argv)
program.parse(process.argv);
