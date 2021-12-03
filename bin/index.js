#! /usr/bin/env node

const program = require('commander');
const test = require('../lib/test');
const export_transactions = require('../lib/export_transactions');
const HexTransactionFinder = require('../lib/HexTransactionFinder');

program
    .command('test') // sub-command name
    .alias('t') // alternative sub-command is `al`
    .description('test') // command description

    // function to execute when command is uses
    .action(function () {
        test();
    });

program
    .command('export_transactions') // sub-command name
    .alias('e') // alternative sub-command is `al`
    .description('export transactions') // command description

    // function to execute when command is uses
    .action(function () {
        //const start_block = 9041184;
        const start_block = 9000000;
        const number_blocks_to_process = 10000;
        const end_block = start_block + number_blocks_to_process;
        const batch_size = 3000;
        export_transactions(start_block, end_block, batch_size);
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