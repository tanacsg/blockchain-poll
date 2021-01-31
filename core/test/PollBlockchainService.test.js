"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PollBlockchainService_1 = require("../PollBlockchainService");
const PollBlockchain_1 = require("../PollBlockchain");
const globals_1 = require("@jest/globals");
const sha256 = require('sha256');
globals_1.describe('PollBlockchainService works correctly', () => {
    const pollBlockchainService = new PollBlockchainService_1.PollBlockchainService();
    globals_1.it('adds votes and create new block', () => {
        const poll = new PollBlockchain_1.PollBlockchain("1", "Employee Survey");
        pollBlockchainService.createNewBlock(poll);
        poll.pendingData.votes.push("Banan");
        poll.pendingData.votes.push("Narancs");
        // console.log(JSON.stringify(poll));
        globals_1.expect(poll.chain.length).toEqual(2);
        globals_1.expect(poll.pendingData.votes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.chain.length).toEqual(3);
        const block = poll.chain[poll.chain.length - 1];
        globals_1.expect(poll.pendingData.votes).toEqual([]);
        globals_1.expect(block.votes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
    });
    globals_1.it('registers a user', () => {
        const poll = new PollBlockchain_1.PollBlockchain("1", "Employee Survey");
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.pendingData.ballotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingData.registeredUserHashCodes).toHaveLength(0);
        const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);
        globals_1.expect(ballotCode).not.toBeNull();
        const ballotCodeHash = sha256(ballotCode);
        globals_1.expect(poll.pendingData.ballotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingData.registeredUserHashCodes).toContain(sha256("tanacsg"));
    });
    globals_1.it('votes with a ballot code', () => {
        const poll = new PollBlockchain_1.PollBlockchain("1", "Employee Survey");
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.pendingData.ballotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingData.registeredUserHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingData.usedBallotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingData.votes).toHaveLength(0);
        const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);
        globals_1.expect(ballotCode).not.toBeNull();
        const ballotCodeHash = sha256(ballotCode);
        globals_1.expect(poll.pendingData.ballotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingData.registeredUserHashCodes).toContain(sha256("tanacsg"));
        pollBlockchainService.vote(ballotCode, "Dissatisfied", poll);
        globals_1.expect(poll.pendingData.usedBallotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingData.votes).toContain("Dissatisfied");
    });
});
//# sourceMappingURL=PollBlockchainService.test.js.map