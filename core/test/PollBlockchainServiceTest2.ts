import PollBlockchainService from "../PollBlockchainService";
import PollBlockchain from  "../PollBlockchain";



const poll = new PollBlockchain("1", "Employee Survey", ["Very satisfied", "Not satisfied"]) 


const pollBlockchainService = new PollBlockchainService();

const hash = pollBlockchainService.hashBlock("alma", {"vote": "First"});

console.log('Hash: ' + hash);

pollBlockchainService.createNewBlock(poll);