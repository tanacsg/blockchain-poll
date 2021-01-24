"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollBlock = exports.PollBlockchain = void 0;
class PollBlockchain {
    constructor(id, name, pendingVotes) {
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.pendingRegisteredUserHashCodes = [];
        this.pendingBallotCodeHashCodes = [];
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.chain = [new PollBlock(1, name, [], "0", "0")];
    }
}
exports.PollBlockchain = PollBlockchain;
class PollBlock {
    constructor(index, name, votes, hash, previousHash) {
        this.index = index;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
        this.registeredUserHashCodes = [];
        this.ballotCodeHashCodes = [];
        this.index = index;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
    }
}
exports.PollBlock = PollBlock;
//# sourceMappingURL=PollBlockchain.js.map