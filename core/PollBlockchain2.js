"use strict";
exports.__esModule = true;
exports.PollBlock = exports.PollBlockchain = void 0;
var PollBlockchain = /** @class */ (function () {
    function PollBlockchain(id, name, pendingVotes) {
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.chain = [new PollBlock(1, name, [], "0", "0")];
    }
    return PollBlockchain;
}());
exports.PollBlockchain = PollBlockchain;
var PollBlock = /** @class */ (function () {
    function PollBlock(id, name, votes, hash, previousHash) {
        this.id = id;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
        this.id = id;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
    }
    return PollBlock;
}());
exports.PollBlock = PollBlock;
