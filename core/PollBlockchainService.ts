import { PollBlock, PollBlockchain } from "./PollBlockchain";
import { v4 as uuidv4 } from 'uuid';
const sha256 = require( 'sha256' );

export class PollBlockchainService{
  constructor(){}

  hashBlock(previousHash, blockData ) {
    const data = previousHash + JSON.stringify(blockData);
    const hash = data;
    return hash;
  }

  createNewBlock(pollBlockchain: PollBlockchain) {
      let p = pollBlockchain;
      let length = p.chain.length;
      let lastBlock : PollBlock = p.chain[length - 1]
      let blockContent = JSON.stringify(pollBlockchain.pendingData.votes) + JSON.stringify(pollBlockchain.pendingData.registeredUserHashCodes) +
      JSON.stringify(pollBlockchain.pendingData.ballotCodeHashCodes) + JSON.stringify( pollBlockchain.pendingData.usedBallotCodeHashCodes)


      let blockHash = sha256(blockContent + lastBlock.hash)
      let pollBlock = new PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.id, pollBlockchain.pollStatus,  pollBlockchain.pendingData.votes,
        pollBlockchain.pendingData.registeredUserHashCodes, pollBlockchain.pendingData.ballotCodeHashCodes,
        pollBlockchain.pendingData.usedBallotCodeHashCodes, "0", lastBlock.hash)



      pollBlockchain.chain.push(pollBlock);

      pollBlockchain.pendingData.votes = []
      pollBlockchain.pendingData.registeredUserHashCodes = []
      pollBlockchain.pendingData.ballotCodeHashCodes = []
      pollBlockchain.pendingData.usedBallotCodeHashCodes = []
  }

  createNewBlock2(pollBlockchain: PollBlockchain): PollBlock {
    let length = pollBlockchain.chain.length;
    let lastBlock : PollBlock = pollBlockchain.chain[length - 1]

    let previousBlockHash = sha256(JSON.stringify(lastBlock))
    let pollBlock = new PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.id, pollBlockchain.pollStatus,  pollBlockchain.pendingData.votes,
      pollBlockchain.pendingData.registeredUserHashCodes, pollBlockchain.pendingData.ballotCodeHashCodes,
      pollBlockchain.pendingData.usedBallotCodeHashCodes, "", previousBlockHash)

    let pollDatakHash = sha256(JSON.stringify(pollBlock.data) + previousBlockHash)

    pollBlock.hash = pollDatakHash
    return pollBlock

}

  registerUser(username: string, pollBlockchain: PollBlockchain): string {

    const usernameHash = sha256(username)
    if (pollBlockchain.pendingData.registeredUserHashCodes.includes(usernameHash)) {
      throw new Error("username: " + username + " is already registered.")
    }

    const ballotCode = uuidv4()

    pollBlockchain.pendingData.registeredUserHashCodes.push(usernameHash)
    const ballotCodeHash = sha256(ballotCode)
    pollBlockchain.pendingData.ballotCodeHashCodes.push(ballotCodeHash)
    return ballotCode;
  }

  registerUser2(username: string): RegisterReturn {

    const usernameHash = sha256(username)

    const ballotCode = uuidv4()
    const ballotCodeHash = sha256(ballotCode)

    const ret = new RegisterReturn(usernameHash,ballotCodeHash,ballotCode)

    return ret;
  }

  vote(ballotCode: string, vote: string, pollBlockchain: PollBlockchain) {
    const ballotCodeHash = sha256(ballotCode)
    if (pollBlockchain.pendingData.usedBallotCodeHashCodes.includes(ballotCodeHash)){
      throw new Error("Ballot code: " + ballotCode + " was already used.")
    }
    pollBlockchain.pendingData.usedBallotCodeHashCodes.push(ballotCodeHash)
    pollBlockchain.pendingData.votes.push(vote)

  }

  vote2(ballotCode: string, votes: string[]) : VoteReturn {
    const ballotCodeHash = sha256(ballotCode)

    return new VoteReturn(ballotCodeHash, votes )
  }

}

export class VoteReturn {
  constructor(public usedBallotCodeHashCodes: string, public votes: string[]) {
  }
}

export class RegisterReturn {

  constructor(public pendingRegisteredUserHashCodes: string, public pendingBallotCodeHashCodes: string, public ballotCode: string) {
  }
}

