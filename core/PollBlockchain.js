"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollStatus = exports.PollBlock = exports.PollBlockchain = void 0;
class PollBlockchain {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.pollStatus = PollStatus.Registering;
        this.pendingRegisteredUserHashCodes = [];
        this.pendingBallotCodeHashCodes = [];
        this.pendingVotes = [];
        this.id = id;
        this.name = name;
        this.chain = [new PollBlock(1, name, [], [], [], [], "0", "0")];
    }
}
exports.PollBlockchain = PollBlockchain;
class PollBlock {
    constructor(index, name, votes, registeredUserHashCodes, ballotCodeHashCodes, usedBallotCodeHashCodes, hash, previousHash) {
        this.index = index;
        this.name = name;
        this.votes = votes;
        this.registeredUserHashCodes = registeredUserHashCodes;
        this.ballotCodeHashCodes = ballotCodeHashCodes;
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
        this.hash = hash;
        this.previousHash = previousHash;
        this.timestamp = new Date();
    }
}
exports.PollBlock = PollBlock;
var PollStatus;
(function (PollStatus) {
    PollStatus[PollStatus["Registering"] = 0] = "Registering";
    PollStatus[PollStatus["Voting"] = 1] = "Voting";
    PollStatus[PollStatus["Closed"] = 2] = "Closed";
})(PollStatus = exports.PollStatus || (exports.PollStatus = {}));
//# sourceMappingURL=PollBlockchain.js.map