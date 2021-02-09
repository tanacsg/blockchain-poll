"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterReturn = exports.VoteReturn = exports.PollBlockchainService = void 0;
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
        let blockContent = JSON.stringify(pollBlockchain.pendingData.votes) + JSON.stringify(pollBlockchain.pendingData.registeredUserHashCodes) +
            JSON.stringify(pollBlockchain.pendingData.ballotCodeHashCodes) + JSON.stringify(pollBlockchain.pendingData.usedBallotCodeHashCodes);
        let blockHash = sha256(blockContent + lastBlock.hash);
        let pollBlock = new PollBlockchain_1.PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.id, pollBlockchain.pollStatus, pollBlockchain.pendingData.votes, pollBlockchain.pendingData.registeredUserHashCodes, pollBlockchain.pendingData.ballotCodeHashCodes, pollBlockchain.pendingData.usedBallotCodeHashCodes, "0", lastBlock.hash);
        pollBlockchain.chain.push(pollBlock);
        pollBlockchain.pendingData.votes = [];
        pollBlockchain.pendingData.registeredUserHashCodes = [];
        pollBlockchain.pendingData.ballotCodeHashCodes = [];
        pollBlockchain.pendingData.usedBallotCodeHashCodes = [];
    }
    createNewBlock2(pollBlockchain) {
        let length = pollBlockchain.chain.length;
        let lastBlock = pollBlockchain.chain[length - 1];
        let previousBlockHash = sha256(JSON.stringify(lastBlock));
        let pollBlock = new PollBlockchain_1.PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.id, pollBlockchain.pollStatus, pollBlockchain.pendingData.votes, pollBlockchain.pendingData.registeredUserHashCodes, pollBlockchain.pendingData.ballotCodeHashCodes, pollBlockchain.pendingData.usedBallotCodeHashCodes, "", previousBlockHash);
        let pollDatakHash = sha256(JSON.stringify(pollBlock.data) + previousBlockHash);
        pollBlock.hash = pollDatakHash;
        return pollBlock;
    }
    registerUser(username, pollBlockchain) {
        const usernameHash = sha256(username);
        if (pollBlockchain.pendingData.registeredUserHashCodes.includes(usernameHash)) {
            throw new Error("username: " + username + " is already registered.");
        }
        const ballotCode = uuid_1.v4();
        pollBlockchain.pendingData.registeredUserHashCodes.push(usernameHash);
        const ballotCodeHash = sha256(ballotCode);
        pollBlockchain.pendingData.ballotCodeHashCodes.push(ballotCodeHash);
        return ballotCode;
    }
    registerUser2(username) {
        const usernameHash = sha256(username);
        const ballotCode = uuid_1.v4();
        const ballotCodeHash = sha256(ballotCode);
        const ret = new RegisterReturn(usernameHash, ballotCodeHash, ballotCode);
        return ret;
    }
    vote(ballotCode, vote, pollBlockchain) {
        const ballotCodeHash = sha256(ballotCode);
        if (pollBlockchain.pendingData.usedBallotCodeHashCodes.includes(ballotCodeHash)) {
            throw new Error("Ballot code: " + ballotCode + " was already used.");
        }
        pollBlockchain.pendingData.usedBallotCodeHashCodes.push(ballotCodeHash);
        pollBlockchain.pendingData.votes.push(vote);
    }
    vote2(ballotCode, votes) {
        const ballotCodeHash = sha256(ballotCode);
        const votesString = JSON.stringify(votes);
        const receipt = sha256(ballotCode + votesString);
        votes.push(receipt);
        return new VoteReturn(ballotCodeHash, votes);
    }
}
exports.PollBlockchainService = PollBlockchainService;
class VoteReturn {
    constructor(usedBallotCodeHashCodes, votes) {
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
        this.votes = votes;
    }
}
exports.VoteReturn = VoteReturn;
class RegisterReturn {
    constructor(pendingRegisteredUserHashCodes, pendingBallotCodeHashCodes, ballotCode) {
        this.pendingRegisteredUserHashCodes = pendingRegisteredUserHashCodes;
        this.pendingBallotCodeHashCodes = pendingBallotCodeHashCodes;
        this.ballotCode = ballotCode;
    }
}
exports.RegisterReturn = RegisterReturn;
//# sourceMappingURL=PollBlockchainService.js.map