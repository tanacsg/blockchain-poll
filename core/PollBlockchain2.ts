export class PollBlockchain {
    chain: PollBlock[];
    
    constructor(public id: number, public name: string, public pendingVotes: string[]) {
        this.id = id;
        this.name = name;
        this.pendingVotes = pendingVotes;
        this.chain = [new PollBlock(1,name,[], "0", "0")];
      }
}

export class PollBlock {
    constructor(public id: number, public name: string, public votes: string[], public hash: string, public previousHash: string) {
        this.id = id;
        this.name = name;
        this.votes = votes;
        this.hash = hash;
        this.previousHash = previousHash;
      }
}