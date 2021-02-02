export class PollBlockchain {
  chain: PollBlock[]
  pollStatus: PollStatus = PollStatus.Registering
  pendingData: PollData = new PollData([],[],[],[])
  pollQuestions: PollQuestion[] = [new PollQuestion("",["",""])]

  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
    this.chain = [new PollBlock(0, name, id, PollStatus.Registering, [], [], [], [], "0", "0")];
  }
}

export class PollBlock {

  public timestamp: Date = new Date()
  public data;

  constructor(public index: number, public pollName: string, public pollId: string, public pollStatus: PollStatus, public votes: string[], public registeredUserHashCodes: string[],
    public ballotCodeHashCodes: string[], public usedBallotCodeHashCodes: string [], public hash: string, public previousBlockHash: string) {
      this.data = new PollData(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes)
  }
}

export class PollData {

  constructor(public registeredUserHashCodes: string[],public ballotCodeHashCodes: string[],public votes: string[],public usedBallotCodeHashCodes: string []) {}

}

export enum PollStatus {
  Registering = "REGISTERING",
  Voting = "VOTING",
  Closed = "CLOSED"
}

export class PollQuestion {
  constructor(public question: string, public options: string[]) {}
}
