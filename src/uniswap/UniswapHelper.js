
//const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const PropertiesSingleton = require('../PropertiesSingleton');

const JSBI = require('jsbi'); 
const Web3 = require('web3');
var fs = require('fs');
const path = require('path');

class UniswapHelper {

    constructor() { 
        this.properties = PropertiesSingleton;
    }


    async price() {

        const jsonFile = path.join(__dirname, '/api.json');
         var parsed = JSON.parse(fs.readFileSync(jsonFile));
        // var abi = parsed.abi;
        const { abi } = require('./api.json');
        
        console.log('Here');
        
        var factoryV3 = 
            new web3.eth.Contract(V3_factory_ABI.factory, factoryV3_address); 
        var pool_address = await factoryV3.methods.getPool(dai_address,WETH_address,3000).call(); 
        //var pool_1 = new web3.eth.Contract(V3_pool_ABI, pool_address); 
        //var pool_balance = await pool_1.methods.slot0.call().call(); 
        //var sqrtPriceX96 = pool_balance[0];

        //var number_1 =JSBI.BigInt(sqrtPriceX96 sqrtPriceX96 (1e(decimals_token_0))/(1e(decimals_token_1))/JSBI.BigInt(2) ** (JSBI.BigInt(192));
    
        console.log('done');
    }


}

module.exports = UniswapHelper;