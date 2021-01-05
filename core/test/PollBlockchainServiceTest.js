const PollBlockchainService = require('../PollBlockchainService.js');
const PollBlockchain = require('../PollBlockchain.js');



const poll = new PollBlockchain("1", "Employee Survey", ["Very satisfied", "Not satisfied"]) 


const pollBlockchainService = new PollBlockchainService();

const hash = pollBlockchainService.hashBlock("alma", {"vote": "First"});

console.log('Hash: ' + hash);