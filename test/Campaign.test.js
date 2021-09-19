const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    // get accounts
    accounts = await web3.eth.getAccounts();

    // deploy campaign factory
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface)) // instantiate contract with ABI
        .deploy({ data: compiledFactory.bytecode }) // arguments used for contract's constructor function
        .send({ from: accounts[0], gas: '1000000'}); // send a transaction that creates the contract on the network

    // create a campaign with the factory
    await factory.methods.createCampaign('100').send({  
        from: accounts[1],
        gas: '1000000'
    });

    // get campaign address from factory
    const addresses = await factory.methods.getCampaigns().call();
    campaignAddress = addresses[0];

    // create campaign reference using existing address
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
});

describe('Campaigns', () => {
    it('deploys a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('marks creator as the manager of campaign', async () => {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[1], manager);
    });

    it('allows to contribute and marks as approver', async () => {
        await campaign.methods.contribute().send({ 
            from: accounts[2], 
            value: 101, 
            gas: '1000000' });

        const isApprover = await campaign.methods.approvers(accounts[2]).call();

        assert(isApprover);
    });
});