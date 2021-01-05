const PollBlockchain = require( './PollBlockchain.js' );
const sha256 = require( 'sha256' );


module.exports = class PollBlockchainService{
  constructor(){}

  hashBlock(previousHash, blockData ) {
    const data = previousHash + JSON.stringify(blockData);
    const hash = sha256(data);
    console.log(hash);
    return hash;
  }  

}


const poll = new PollBlockchain("1", "Employee Survey", ["Very satisfied", "Not satisfied"]) 

console.log(poll)