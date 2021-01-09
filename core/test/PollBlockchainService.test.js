"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PollBlockchainService_1 = require("../PollBlockchainService");
var PollBlockchain_1 = require("../PollBlockchain");
var globals_1 = require("@jest/globals");
globals_1.describe('PollBlockchainService works correctly', function () {
    var pollBlockchainService = new PollBlockchainService_1.PollBlockchainService();
    globals_1.it('adds votes and create new block', function () {
        var poll = new PollBlockchain_1.PollBlockchain(1, "Employee Survey", ["Very satisfied", "Not satisfied"]);
        pollBlockchainService.createNewBlock(poll);
        poll.pendingVotes.push("Banan");
        poll.pendingVotes.push("Narancs");
        // console.log(JSON.stringify(poll));
        globals_1.expect(poll.chain.length).toEqual(2);
        globals_1.expect(poll.pendingVotes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
        pollBlockchainService.createNewBlock(poll);
        globals_1.expect(poll.chain.length).toEqual(3);
        var block = poll.chain[poll.chain.length - 1];
        globals_1.expect(poll.pendingVotes).toEqual([]);
        globals_1.expect(block.votes).toEqual(globals_1.expect.arrayContaining(["Banan", "Narancs"]));
    });
});
//# sourceMappingURL=PollBlockchainService.test.js.map