export class PollBlockchain {
  chain: PollBlock[]
  pollStatus: PollStatus = PollStatus.Registering
  pollQuestions: PollQuestion[] = [new PollQuestion("",["",""])]

  pendingData: PendingPollData = new PendingPollData([],[],[],[])

  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
    this.chain = [new PollBlock(0, name, id, PollStatus.Registering, [], [], [], [], "0", "0", this.pollQuestions)];
  }
}

export class PollBlock {

  public timestamp: Date = new Date()
  public data: PollData;

  constructor(public index: number, public pollName: string, public pollId: string, public pollStatus: PollStatus, votes: string[], registeredUserHashCodes: string[],
    ballotCodeHashCodes: string[], usedBallotCodeHashCodes: string [], public hash: string, public previousBlockHash: string, pollQuestions: PollQuestion[]) {
      this.data = new PollData(registeredUserHashCodes, ballotCodeHashCodes, votes, usedBallotCodeHashCodes, pollQuestions, pollStatus)
  }
}

export class PollData {

  constructor(public registeredUserHashCodes: string[],public ballotCodeHashCodes: string[],public votes: string[],public usedBallotCodeHashCodes: string [],public pollQuestions: PollQuestion[],public pollStatus: PollStatus) {}

}

export class PendingPollData {

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
