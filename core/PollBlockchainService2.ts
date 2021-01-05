import { PollBlock, PollBlockchain } from "./PollBlockchain2";
// const sha256 = require( 'sha256' );

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
      console.log("Newer: " + p)
  }

}

