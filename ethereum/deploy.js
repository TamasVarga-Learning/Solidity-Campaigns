require('dotenv').config();

const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC, 
  process.env.RINKEBY_ENDPOINT);
const web3 = new Web3(provider);

// creating a function to be able to use async-await syntax
const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // instantiate contract with ABI
      .deploy({ data: compiledFactory.bytecode }) 
      .send({ from: accounts[0], gas: '1000000', gasPrice: '5000000000' }); // send a transaction that creates the contract on the network

  console.log('Contract deployed to', result.options.address);
};  

deploy(); 