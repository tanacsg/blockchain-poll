"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollBlockchainService = void 0;
const PollBlockchain_1 = require("./PollBlockchain");
const uuid_1 = require("uuid");
const sha256 = require('sha256');
class PollBlockchainService {
    constructor() { }
    hashBlock(previousHash, blockData) {
        const data = previousHash + JSON.stringify(blockData);
        const hash = data;
        return hash;
    }
    createNewBlock(pollBlockchain) {
        let p = pollBlockchain;
        let length = p.chain.length;
        let lastBlock = p.chain[length - 1];
        let blockContent = JSON.stringify(pollBlockchain.pendingVotes) + JSON.stringify(pollBlockchain.pendingRegisteredUserHashCodes) +
            JSON.stringify(pollBlockchain.pendingBallotCodeHashCodes) + JSON.stringify(pollBlockchain.pendingUsedBallotCodeHashCodes);
        let blockHash = sha256(blockContent + lastBlock.hash);
        let pollBlock = new PollBlockchain_1.PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.pendingVotes, pollBlockchain.pendingRegisteredUserHashCodes, pollBlockchain.pendingBallotCodeHashCodes, pollBlockchain.pendingUsedBallotCodeHashCodes, blockHash, lastBlock.hash);
        pollBlockchain.chain.push(pollBlock);
        pollBlockchain.pendingVotes = [];
        pollBlockchain.pendingRegisteredUserHashCodes = [];
        pollBlockchain.pendingBallotCodeHashCodes = [];
        pollBlockchain.pendingUsedBallotCodeHashCodes = [];
    }
    registerUser(username, pollBlockchain) {
        const usernameHash = sha256(username);
        if (pollBlockchain.pendingRegisteredUserHashCodes.includes(usernameHash)) {
            throw new Error("username: " + username + " is already registered.");
        }
        const ballotCode = uuid_1.v4();
        pollBlockchain.pendingRegisteredUserHashCodes.push(usernameHash);
        const ballotCodeHash = sha256(ballotCode);
        pollBlockchain.pendingBallotCodeHashCodes.push(ballotCodeHash);
        return ballotCode;
    }
    vote(ballotCode, vote, pollBlockchain) {
        const ballotCodeHash = sha256(ballotCode);
        if (pollBlockchain.pendingUsedBallotCodeHashCodes.includes(ballotCodeHash)) {
            throw new Error("Ballot code: " + ballotCode + " was already used.");
        }
        pollBlockchain.pendingUsedBallotCodeHashCodes.push(ballotCodeHash);
        pollBlockchain.pendingVotes.push(vote);
    }
}
exports.PollBlockchainService = PollBlockchainService;
//# sourceMappingURL=PollBlockchainService.js.map