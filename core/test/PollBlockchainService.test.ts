import { PollBlockchainService } from "../PollBlockchainService"
import { PollBlockchain } from "../PollBlockchain";
import { describe, expect, it, test } from '@jest/globals'

const sha256 = require( 'sha256' );

describe('PollBlockchainService works correctly', () => {

    const pollBlockchainService = new PollBlockchainService();


    it('adds votes and create new block', () => {
        const poll = new PollBlockchain("1", "Employee Survey")

        pollBlockchainService.createNewBlock(poll);

        poll.pendingVotes.push("Banan")
        poll.pendingVotes.push("Narancs")

        // console.log(JSON.stringify(poll));
        expect(poll.chain.length).toEqual(2);

        expect(poll.pendingVotes).toEqual(expect.arrayContaining(["Banan", "Narancs"]));

        pollBlockchainService.createNewBlock(poll);

        expect(poll.chain.length).toEqual(3);

        const block = poll.chain[poll.chain.length - 1]

        expect(poll.pendingVotes).toEqual([]);
        expect(block.votes).toEqual(expect.arrayContaining(["Banan", "Narancs"]));

    });

    it('registers a user', () => {
      const poll = new PollBlockchain("1", "Employee Survey")

      pollBlockchainService.createNewBlock(poll);

      expect(poll.pendingBallotCodeHashCodes).toHaveLength(0)
      expect(poll.pendingRegisteredUserHashCodes).toHaveLength(0)
      const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);

      expect(ballotCode).not.toBeNull();

      const ballotCodeHash = sha256(ballotCode);
      expect(poll.pendingBallotCodeHashCodes).toContain(ballotCodeHash)
      expect(poll.pendingRegisteredUserHashCodes).toContain(sha256("tanacsg"))

  });

  it('votes with a ballot code', () => {
    const poll = new PollBlockchain("1", "Employee Survey")

    pollBlockchainService.createNewBlock(poll);

    expect(poll.pendingBallotCodeHashCodes).toHaveLength(0)
    expect(poll.pendingRegisteredUserHashCodes).toHaveLength(0)
    expect(poll.pendingUsedBallotCodeHashCodes).toHaveLength(0)
    expect(poll.pendingVotes).toHaveLength(0)

    const ballotCode = pollBlockchainService.registerUser("tanacsg", poll);

    expect(ballotCode).not.toBeNull();

    const ballotCodeHash = sha256(ballotCode);
    expect(poll.pendingBallotCodeHashCodes).toContain(ballotCodeHash)
    expect(poll.pendingRegisteredUserHashCodes).toContain(sha256("tanacsg"))

    pollBlockchainService.vote(ballotCode, "Dissatisfied", poll)
    expect(poll.pendingUsedBallotCodeHashCodes).toContain(ballotCodeHash)
    expect(poll.pendingVotes).toContain("Dissatisfied")
  });
}
);
