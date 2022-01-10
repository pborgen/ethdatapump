#! /usr/bin/env node

const program = require('commander');
const ExportTransactions = require('../lib/export_transactions');
const HexTransactionFinder = require('../lib/HexTransactionFinder');
const ExportTransactionsFromToAddress = require('../lib/export_transactions_from_to_address');

program
    .command('export_transactions') // sub-command name
    .alias('e') // alternative sub-command is `al`
    .description('export transactions') // command description

    // function to execute when command is uses
    .action(function () {
        //const start_block = 9041184;
        const start_block = 9000000;
        const number_blocks_to_process = 4000000;
        const end_block = start_block + number_blocks_to_process;
        const batch_size = 500;

        let exportTransactions = new ExportTransactions();
        exportTransactions.export(start_block, end_block, batch_size);

        console.log('Complete bla');
    });

program
    .command('export_transactions_from_to_address') // sub-command name
    .alias('e') // alternative sub-command is `al`
    .description('export transactions from/to address') // command description

    // function to execute when command is uses
    .action(function () {
        //const start_block = 9041184;
        const start_block = 9000000;
        const number_blocks_to_process = 4000000;
        const end_block = start_block + number_blocks_to_process;
        const batch_size = 500;

        let exportTransactionsFromToAddress = new ExportTransactionsFromToAddress();
        exportTransactionsFromToAddress.export(start_block, end_block);

        console.log('Complete bla');
    });
    

program
    .command('find_hex_transactions') // sub-command name
    .description('find_hex_transactions from csv') // command description

    // function to execute when command is uses
    .action(function () {
        HexTransactionFinder('/mnt/crypto/block_number_with_transactions.js');
    });


// allow commander to parse `process.argv`
program.parse(process.argv);
