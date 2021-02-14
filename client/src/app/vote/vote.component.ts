import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../poll.service';
import { PollBlockchain } from '../../../../core/PollBlockchain';

const sha256 = require('sha256');

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  poll: PollBlockchain;
  pollJSON: string;
  pollJSONLocalBackup: string
  currentVote: string;
  currentVotes: string[] = [];
  ballotCode: string;
  textToNormalize: string;
  textToHash: string;
  normalizationError: string
  calculatedHash: string
  username: string
  errorMessage: string
  successMessage: string
  voteReceipt: String

  constructor(
    private pollService: PollService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.getPoll()
  }

  getPoll(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollService.getPoll(id)
      .subscribe(poll => {
        this.poll = poll;
        this.pollJSON = JSON.stringify(this.poll, undefined, 2)

       });
  }

  storePollInBrowser(): void{
    localStorage.setItem("BLOCKCHAIN_POLL_" + this.poll.id, this.pollJSON);
  }

  loadFromBrowser(): void {
    this.pollJSONLocalBackup = localStorage.getItem("BLOCKCHAIN_POLL_" + this.poll.id);
  }

  uploadLocalBackup(): void {

  }

  vote(): void {
    this.errorMessage = ""
    this.successMessage = ""
    this.voteReceipt = ""
    this.pollService.vote({ 'pollId': this.poll.id, 'ballotCode': this.ballotCode, 'votes': this.currentVotes }).subscribe(
      r => {
        this.successMessage = "Your vote has been casted. Your receipt is technically sha256(ballotCode + stringified votes array)), with that you can verify that your vote is counted. Your receipt:"
        this.voteReceipt = r.receipt
        this.getPoll()
      },
      err => this.errorMessage = err.error.message
    )
  }

  mine(): void {
    this.errorMessage = ""
    this.pollService.mine(this.poll.id).subscribe(
      r => this.getPoll()
    )
  }

  calculateHash(): void {
    this.calculatedHash = sha256(this.textToHash);
  }

  normalize(): void {
    try {
      this.normalizationError = ""
      this.textToNormalize = JSON.stringify(JSON.parse(this.textToNormalize));
    } catch (e) {
      this.normalizationError = "Invalid JSON"
    }
  }

}
