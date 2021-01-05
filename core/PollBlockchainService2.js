"use strict";
exports.__esModule = true;
exports.PollBlockchainService = void 0;
var sha256 = require('sha256');
var PollBlockchainService = /** @class */ (function () {
    function PollBlockchainService() {
    }
    PollBlockchainService.prototype.hashBlock = function (previousHash, blockData) {
        var data = previousHash + JSON.stringify(blockData);
        var hash = sha256(data);
        console.log(hash);
        return hash;
    };
    PollBlockchainService.prototype.createNewBlock = function (pollBlockchain) {
        var p = pollBlockchain;
        console.log("Newer: " + p);
    };
    return PollBlockchainService;
}());
exports.PollBlockchainService = PollBlockchainService;
