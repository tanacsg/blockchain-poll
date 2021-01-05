"use strict";
exports.__esModule = true;
var PollBlockchainService_1 = require("../PollBlockchainService");
var PollBlockchain_1 = require("../PollBlockchain");
var poll = new PollBlockchain_1["default"]("1", "Employee Survey", ["Very satisfied", "Not satisfied"]);
var pollBlockchainService = new PollBlockchainService_1["default"]();
var hash = pollBlockchainService.hashBlock("alma", { "vote": "First" });
console.log('Hash: ' + hash);
pollBlockchainService.createNewBlock(poll);
