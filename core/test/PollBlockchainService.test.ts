import { PollBlockchainService } from "../PollBlockchainService"
import { PollBlockchain } from "../PollBlockchain";
import { describe, expect, it, test } from '@jest/globals'


describe('PollBlockchainService works correctly', () => {

    const pollBlockchainService = new PollBlockchainService();


    it('adds votes and create new block', () => {
        const poll = new PollBlockchain("1", "Employee Survey", ["Very satisfied", "Not satisfied"])



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
}
);
