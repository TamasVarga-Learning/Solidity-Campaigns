const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

// delete build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

// read contract file
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');

// compile contracts
const output = solc.compile(source, 1).contracts;

// write output to build folder
fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}
