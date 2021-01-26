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
        poll.pendingVotes.push("Banan");
        poll.pendingVotes.push("Narancs");
        // console.log(JSON.stringify(poll));
        globals_1.expect(poll.chain.length).toEqual(2);
        globals_1.expect(poll.pendingVotes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.chain.length).toEqual(3);
        const block = poll.chain[poll.chain.length - 1];
        globals_1.expect(poll.pendingVotes).toEqual([]);
        globals_1.expect(block.votes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
    });
    globals_1.it('registers a user', () => {
        const poll = new PollBlockchain_1.PollBlockchain("1", "Employee Survey");
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.pendingBallotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingRegisteredUserHashCodes).toHaveLength(0);
        const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);
        globals_1.expect(ballotCode).not.toBeNull();
        const ballotCodeHash = sha256(ballotCode);
        globals_1.expect(poll.pendingBallotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingRegisteredUserHashCodes).toContain(sha256("tanacsg"));
    });
    globals_1.it('votes with a ballot code', () => {
        const poll = new PollBlockchain_1.PollBlockchain("1", "Employee Survey");
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.pendingBallotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingRegisteredUserHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingUsedBallotCodeHashCodes).toHaveLength(0);
        globals_1.expect(poll.pendingVotes).toHaveLength(0);
        const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);
        globals_1.expect(ballotCode).not.toBeNull();
        const ballotCodeHash = sha256(ballotCode);
        globals_1.expect(poll.pendingBallotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingRegisteredUserHashCodes).toContain(sha256("tanacsg"));
        pollBlockchainService.vote(ballotCode, "Dissatisfied", poll);
        globals_1.expect(poll.pendingUsedBallotCodeHashCodes).toContain(ballotCodeHash);
        globals_1.expect(poll.pendingVotes).toContain("Dissatisfied");
    });
});
//# sourceMappingURL=PollBlockchainService.test.js.map