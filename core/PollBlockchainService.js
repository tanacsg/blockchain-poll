"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollBlockchainService = void 0;
var PollBlockchain_1 = require("./PollBlockchain");
var sha256 = require('sha256');
var PollBlockchainService = /** @class */ (function () {
    function PollBlockchainService() {
    }
    PollBlockchainService.prototype.hashBlock = function (previousHash, blockData) {
        var data = previousHash + JSON.stringify(blockData);
        var hash = data;
        console.log(hash);
        return hash;
    };
    PollBlockchainService.prototype.createNewBlock = function (pollBlockchain) {
        var p = pollBlockchain;
        var length = p.chain.length;
        var lastBlock = p.chain[length - 1];
        var blockHash = sha256(JSON.stringify(pollBlockchain.pendingVotes) + lastBlock.hash);
        var pollBlock = new PollBlockchain_1.PollBlock(lastBlock.id + 1, pollBlockchain.name, pollBlockchain.pendingVotes, blockHash, lastBlock.hash);
        pollBlockchain.chain.push(pollBlock);
        pollBlockchain.pendingVotes = [];
    };
    return PollBlockchainService;
}());
exports.PollBlockchainService = PollBlockchainService;
//# sourceMappingURL=PollBlockchainService.js.map