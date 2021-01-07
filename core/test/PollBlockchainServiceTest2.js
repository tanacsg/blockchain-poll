"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PollBlockchainService_1 = require("../PollBlockchainService");
var PollBlockchain_1 = require("../PollBlockchain");
var poll = new PollBlockchain_1.PollBlockchain(1, "Employee Survey", ["Very satisfied", "Not satisfied"]);
var pollBlockchainService = new PollBlockchainService_1.PollBlockchainService();
var hash = pollBlockchainService.hashBlock("alma", { "vote": "First" });
pollBlockchainService.createNewBlock(poll);
poll.pendingVotes.push("Banan");
poll.pendingVotes.push("Narancs");
console.log(JSON.stringify(poll));
pollBlockchainService.createNewBlock(poll);
console.log(JSON.stringify(poll));
//# sourceMappingURL=PollBlockchainServiceTest2.js.map