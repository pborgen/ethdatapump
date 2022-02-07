#! /usr/bin/env node

const program = require('commander');
const TransactionsExporter = require('../lib/exporter/TransactionsExporter');
const HexTransactionFinder = require('../lib/HexTransactionFinder');
const ExportTransactionsFromToAddress = require('../lib/ExportTransactionsFromToAddress');
const GetTransaction = require('../lib/GetTransaction');
const Tracker = require('../lib/Tracker');
const TransactionsExporterToFrom = require('../lib/exporter/TransactionsExporterToFrom');

const Web3ConnectionCreator = require('../lib/Web3ConnectionCreator');

program
    .command('export_transactions') // sub-command name
    .alias('e') // alternative sub-command is `al`
    .description('export transactions') // command description

    // function to execute when command is uses
    .action(function () {
        let transactionsExporter = new TransactionsExporter();

        transactionsExporter.export();

        console.log('Complete bla');
    });

program
    .command('export_transactions_from_to_address') // sub-command name
    .alias('eft') 
    .description('export transactions from/to address') // command description

    // function to execute when command is uses
    .action(function () {
        const base_path = '/home/paul/dev';
        
        const block_number_with_transactions_full_path = '';
        let transactionsExporterToFrom = new TransactionsExporterToFrom();
        transactionsExporterToFrom.export();


        console.log('Complete bla');
    });

program
    .command('getTransaction') // sub-command name
    .alias('et') 
    .description('getTransaction') // command description

    // function to execute when command is uses
    .action(function () {
        let getTransaction = new GetTransaction();
        getTransaction.export('0xf449665bddefcaf3f2bebe7aa54b93cb5b3a30c3b4c04d498bdcf8b2edca4bdf');

        console.log('Complete bla');
    });

program
    .command('find_hex_transactions') // sub-command name
    .description('find_hex_transactions from csv') // command description

    // function to execute when command is uses
    .action(function () {
        HexTransactionFinder('/mnt/crypto/block_number_with_transactions.js');
    });

program
    .command('testtrackeryaml') // sub-command name
    .description('testtrackeryaml') // command description

    // function to execute when command is uses
    .action(function () {
        let tracker = new Tracker();
        tracker.updateExportTransactionsTracker(11, 22);

        console.log('Complete bla');
    });



// allow commander to parse `process.argv`
program.parse(process.argv);
