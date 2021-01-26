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
      let blockHash = sha256(JSON.stringify(pollBlockchain.pendingVotes) + lastBlock.hash)
      let pollBlock = new PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.pendingVotes,
        pollBlockchain.pendingRegisteredUserHashCodes, pollBlockchain.pendingBallotCodeHashCodes,
        pollBlockchain.pendingUsedBallotCodeHashCodes, blockHash, lastBlock.hash)
      pollBlockchain.chain.push(pollBlock);
      pollBlockchain.pendingVotes = []
  }

  registerUser(username: string, pollBlockchain: PollBlockchain): string {

    const usernameHash = sha256(username)
    if (pollBlockchain.pendingRegisteredUserHashCodes.includes(usernameHash)) {
      throw new Error("username: " + username + " is already registered.")
    }

    const ballotCode = uuidv4()

    pollBlockchain.pendingRegisteredUserHashCodes.push(usernameHash)
    const ballotCodeHash = sha256(ballotCode)
    pollBlockchain.pendingBallotCodeHashCodes.push(ballotCodeHash)
    return ballotCode;
  }

  vote(ballotCode: string, vote: string, pollBlockchain: PollBlockchain) {
    const ballotCodeHash = sha256(ballotCode)
    if (pollBlockchain.pendingUsedBallotCodeHashCodes.includes(ballotCodeHash)){
      throw new Error("Ballot code: " + ballotCode + " was already used.")
    }
    pollBlockchain.pendingBallotCodeHashCodes.push(ballotCodeHash)
    pollBlockchain.pendingVotes.push(vote)
  }

}

