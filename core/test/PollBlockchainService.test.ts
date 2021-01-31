import { PollBlockchainService } from "../PollBlockchainService"
import { PollBlockchain } from "../PollBlockchain";
import { describe, expect, it, test } from '@jest/globals'

const sha256 = require( 'sha256' );

describe('PollBlockchainService works correctly', () => {

    const pollBlockchainService = new PollBlockchainService();


    it('adds votes and create new block', () => {
        const poll = new PollBlockchain("1", "Employee Survey")

        pollBlockchainService.createNewBlock(poll);

        poll.pendingData.votes.push("Banan")
        poll.pendingData.votes.push("Narancs")

        // console.log(JSON.stringify(poll));
        expect(poll.chain.length).toEqual(2);

        expect(poll.pendingData.votes).toEqual(expect.arrayContaining(["Banan", "Narancs"]));

        pollBlockchainService.createNewBlock(poll);

        expect(poll.chain.length).toEqual(3);

        const block = poll.chain[poll.chain.length - 1]

        expect(poll.pendingData.votes).toEqual([]);
        expect(block.votes).toEqual(expect.arrayContaining(["Banan", "Narancs"]));

    });

    it('registers a user', () => {
      const poll = new PollBlockchain("1", "Employee Survey")

      pollBlockchainService.createNewBlock(poll);

      expect(poll.pendingData.ballotCodeHashCodes).toHaveLength(0)
      expect(poll.pendingData.registeredUserHashCodes).toHaveLength(0)
      const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);

      expect(ballotCode).not.toBeNull();

      const ballotCodeHash = sha256(ballotCode);
      expect(poll.pendingData.ballotCodeHashCodes).toContain(ballotCodeHash)
      expect(poll.pendingData.registeredUserHashCodes).toContain(sha256("tanacsg"))

  });

  it('votes with a ballot code', () => {
    const poll = new PollBlockchain("1", "Employee Survey")

    pollBlockchainService.createNewBlock(poll);

    expect(poll.pendingData.ballotCodeHashCodes).toHaveLength(0)
    expect(poll.pendingData.registeredUserHashCodes).toHaveLength(0)
    expect(poll.pendingData.usedBallotCodeHashCodes).toHaveLength(0)
    expect(poll.pendingData.votes).toHaveLength(0)

    const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);

    expect(ballotCode).not.toBeNull();

    const ballotCodeHash = sha256(ballotCode);
    expect(poll.pendingData.ballotCodeHashCodes).toContain(ballotCodeHash)
    expect(poll.pendingData.registeredUserHashCodes).toContain(sha256("tanacsg"))

    pollBlockchainService.vote(ballotCode, "Dissatisfied", poll)
    expect(poll.pendingData.usedBallotCodeHashCodes).toContain(ballotCodeHash)
    expect(poll.pendingData.votes).toContain("Dissatisfied")
  });
}
);
