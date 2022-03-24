#! /usr/bin/env node

const program = require('commander');

let uniswap = require('../src/uniswap/Uniswap.ts');



program
    .command('uniswap') // sub-command name
    .description('uniswap') // command description

    // function to execute when command is uses
    .action(function () {
        //let bla = new Uniswap();
        uniswap.greet();
        //let uniswapHelper = new UniswapHelper();
        //uniswapHelper.price();
    });




// allow commander to parse `process.argv`
console.log('Arguments passed in: ' + process.argv)
program.parse(process.argv);
