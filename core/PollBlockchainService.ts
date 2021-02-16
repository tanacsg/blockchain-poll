import { PollBlock, PollBlockchain, PollData } from "./PollBlockchain";
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
        pollBlockchain.pendingData.usedBallotCodeHashCodes, "0", lastBlock.hash, pollBlockchain.pollQuestions)



      pollBlockchain.chain.push(pollBlock);

      pollBlockchain.pendingData.votes = []
      pollBlockchain.pendingData.registeredUserHashCodes = []
      pollBlockchain.pendingData.ballotCodeHashCodes = []
      pollBlockchain.pendingData.usedBallotCodeHashCodes = []
  }

  createNewBlock2(pollBlockchain: PollBlockchain): PollBlock {
    let length = pollBlockchain.chain.length;
    let lastBlock : PollBlock = pollBlockchain.chain[length - 1]

    let previousBlockHash = lastBlock.hash
    let pollBlock = new PollBlock(lastBlock.index + 1, pollBlockchain.name, pollBlockchain.id, pollBlockchain.pollStatus,  pollBlockchain.pendingData.votes,
      pollBlockchain.pendingData.registeredUserHashCodes, pollBlockchain.pendingData.ballotCodeHashCodes,
      pollBlockchain.pendingData.usedBallotCodeHashCodes, "", previousBlockHash, pollBlockchain.pollQuestions)

    let pollDataHash = this.hashBlockData(pollBlock.data, previousBlockHash)

    pollBlock.hash = pollDataHash
    return pollBlock

}

  hashBlockData(pollData: PollData, previousBlockHash: string): string {
    return sha256(JSON.stringify(pollData) + previousBlockHash)
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
    const votesString = JSON.stringify(votes);
    const receipt = sha256(ballotCode + votesString)
    votes.push(receipt)

    return new VoteReturn(ballotCodeHash, votes)
  }

  validate(pollBlockchain: PollBlockchain) {
    let validationMessage=''
    for (let i = 1; i < pollBlockchain.chain.length; i++) {
      const currentBlock: PollBlock = pollBlockchain.chain[i];
      const prevBlock: PollBlock = pollBlockchain.chain[i - 1];
      const previousBlockHash = pollBlockchain.chain[i].previousBlockHash
      const blockHashCalculated = this.hashBlockData(currentBlock.data, previousBlockHash)
      if (currentBlock.hash !== blockHashCalculated || currentBlock.previousBlockHash !== prevBlock.hash) {
        validationMessage = 'Validation failed at block with index: ' + currentBlock.index
        return new ValidationResult(false,validationMessage)
      }
    };
    return new ValidationResult(true, "Validation of the chain of blocks is completed. No anomalies found." )
  }

  countVotes(pollBlockchain: PollBlockchain): any[] {
    const allVotes = []
    const pollDiagramData = []

    for (const pendingVotes of pollBlockchain.pendingData.votes) {
      allVotes.push(pendingVotes.slice(0,-1))
    }

    for (const pollBlock of pollBlockchain.chain) {

      for(const votes of pollBlock.data.votes) {
        allVotes.push(votes.slice(0,-1));
      }
    }
    let questionsCount =  pollBlockchain.pollQuestions.length
    for(let i=0;i<questionsCount;i++) {
      let voteCounter = {}
      for(const votes of allVotes) {
        if(votes[i] in voteCounter){
           voteCounter[votes[i]] = voteCounter[votes[i]] + 1
        } else {
          voteCounter[votes[i]] = 1
        }
      }

      let voteCounterConverted = []
      for(let key in voteCounter) {
        voteCounterConverted.push({'name': key,'value': voteCounter[key]})
      }

      pollDiagramData.push(voteCounterConverted)
    }

    return pollDiagramData;
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

export class ValidationResult {
  constructor(public isValid: boolean, public validationMessage: string) {
  }
}

