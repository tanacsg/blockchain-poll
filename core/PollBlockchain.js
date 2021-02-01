"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollQuestion = exports.PollStatus = exports.PollData = exports.PollBlock = exports.PollBlockchain = void 0;
class PollBlockchain {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.pollStatus = PollStatus.Registering;
        this.pendingData = new PollData([], [], [], []);
        this.pollQuestions = [];
        this.id = id;
        this.name = name;
        this.chain = [new PollBlock(0, name, id, PollStatus.Registering, [], [], [], [], "0", "0")];
    }
}
exports.PollBlockchain = PollBlockchain;
class PollBlock {
    constructor(index, pollName, pollId, pollStatus, votes, registeredUserHashCodes, ballotCodeHashCodes, usedBallotCodeHashCodes, hash, previousBlockHash) {
        this.index = index;
        this.pollName = pollName;
        this.pollId = pollId;
        this.pollStatus = pollStatus;
        this.votes = votes;
        this.registeredUserHashCodes = registeredUserHashCodes;
        this.ballotCodeHashCodes = ballotCodeHashCodes;
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
        this.hash = hash;
        this.previousBlockHash = previousBlockHash;
        this.timestamp = new Date();
        this.data = new PollData(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes);
    }
}
exports.PollBlock = PollBlock;
class PollData {
    constructor(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes) {
        this.registeredUserHashCodes = registeredUserHashCodes;
        this.ballotCodeHashCodes = ballotCodeHashCodes;
        this.votes = votes;
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
    }
}
exports.PollData = PollData;
var PollStatus;
(function (PollStatus) {
    PollStatus["Registering"] = "REGISTERING";
    PollStatus["Voting"] = "VOTING";
    PollStatus["Closed"] = "CLOSED";
})(PollStatus = exports.PollStatus || (exports.PollStatus = {}));
class PollQuestion {
    constructor(options) {
        this.options = options;
    }
}
exports.PollQuestion = PollQuestion;
//# sourceMappingURL=PollBlockchain.js.map