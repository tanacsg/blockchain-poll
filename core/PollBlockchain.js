"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollQuestion = exports.PollStatus = exports.PendingPollData = exports.PollData = exports.PollBlock = exports.PollBlockchain = void 0;
class PollBlockchain {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.pollStatus = PollStatus.Registering;
        this.pollQuestions = [new PollQuestion("", ["", ""])];
        this.pendingData = new PendingPollData([], [], [], []);
        this.id = id;
        this.name = name;
        this.chain = [new PollBlock(0, name, id, this.pollStatus, [], [], [], [], "0", "0", this.pollQuestions)];
    }
}
exports.PollBlockchain = PollBlockchain;
class PollBlock {
    constructor(index, pollName, pollId, pollStatus, votes, registeredUserHashCodes, ballotCodeHashCodes, usedBallotCodeHashCodes, hash, previousBlockHash, pollQuestions) {
        this.index = index;
        this.hash = hash;
        this.previousBlockHash = previousBlockHash;
        this.timestamp = new Date();
        this.data = new PollData(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes, pollQuestions, pollStatus, pollId, pollName);
    }
}
exports.PollBlock = PollBlock;
class PollData {
    constructor(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes, pollQuestions, pollStatus, pollId, pollName) {
        this.registeredUserHashCodes = registeredUserHashCodes;
        this.ballotCodeHashCodes = ballotCodeHashCodes;
        this.votes = votes;
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
        this.pollQuestions = pollQuestions;
        this.pollStatus = pollStatus;
        this.pollId = pollId;
        this.pollName = pollName;
    }
}
exports.PollData = PollData;
class PendingPollData {
    constructor(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes) {
        this.registeredUserHashCodes = registeredUserHashCodes;
        this.ballotCodeHashCodes = ballotCodeHashCodes;
        this.votes = votes;
        this.usedBallotCodeHashCodes = usedBallotCodeHashCodes;
    }
}
exports.PendingPollData = PendingPollData;
var PollStatus;
(function (PollStatus) {
    PollStatus["Registering"] = "REGISTERING";
    PollStatus["Voting"] = "VOTING";
    PollStatus["Closed"] = "CLOSED";
})(PollStatus = exports.PollStatus || (exports.PollStatus = {}));
class PollQuestion {
    constructor(question, options) {
        this.question = question;
        this.options = options;
    }
}
exports.PollQuestion = PollQuestion;
//# sourceMappingURL=PollBlockchain.js.map