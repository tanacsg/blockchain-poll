import { PollBlockchainService } from "../PollBlockchainService"
import { PollBlockchain } from "../PollBlockchain";
import {describe, expect, it, test } from '@jest/globals'

test('adds 1 + 2 to equal 3', () => {
    const poll = new PollBlockchain(1, "Employee Survey", ["Very satisfied", "Not satisfied"])


    const pollBlockchainService = new PollBlockchainService();

    const hash = pollBlockchainService.hashBlock("alma", { "vote": "First" });

    pollBlockchainService.createNewBlock(poll);

    poll.pendingVotes.push("Banan")
    poll.pendingVotes.push("Narancs")

    console.log(JSON.stringify(poll));

    pollBlockchainService.createNewBlock(poll);


    console.log(JSON.stringify(poll));

});


