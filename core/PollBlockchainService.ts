import { PollBlock, PollBlockchain } from "./PollBlockchain";
const sha256 = require( 'sha256' );

export class PollBlockchainService{
  constructor(){}

  hashBlock(previousHash, blockData ) {
    const data = previousHash + JSON.stringify(blockData);
    const hash = data;
    console.log(hash);
    return hash;
  }  

  createNewBlock(pollBlockchain: PollBlockchain) {
      let p = pollBlockchain;
      let length = p.chain.length;
      let lastBlock : PollBlock = p.chain[length - 1] 
      let blockHash = sha256(JSON.stringify(pollBlockchain.pendingVotes) + lastBlock.hash)
      let pollBlock = new PollBlock(lastBlock.id +1, pollBlockchain.name, pollBlockchain.pendingVotes, blockHash, lastBlock.hash)
      pollBlockchain.chain.push(pollBlock);
      pollBlockchain.pendingVotes = []
  }

}

