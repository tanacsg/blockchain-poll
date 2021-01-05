module.exports = class PollBlockchain {
    
    constructor(id, name, pendingVotes) {
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.chain = [new PollBlock(1,name,[], 0, 0)];
      }
}

module.exports = class PollBlock {
    constructor(id, name, votes, hash, previousHash) {
        this.id = id;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
      }
}