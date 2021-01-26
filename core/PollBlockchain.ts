export class PollBlockchain {
  chain: PollBlock[]
  pollStatus: PollStatus = PollStatus.Registering

  pendingRegisteredUserHashCodes: string[] = []
  pendingBallotCodeHashCodes: string[] = []
  pendingVotes: string[] = []
  pendingUsedBallotCodeHashCodes: string []

  constructor(public id: string, public name: string) {
    this.id = id;
    this.name = name;
    this.chain = [new PollBlock(1, name, [], [], [], [], "0", "0")];
  }
}

export class PollBlock {


  constructor(public index: number, public name: string, public votes: string[], registeredUserHashCodes: string[],
    ballotCodeHashCodes: string[], usedBallotCodeHashCodes: string [], public hash: string, public previousHash: string) {
  }
}

export enum PollStatus {
  Registering,
  Voting,
  Closed

}
