import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../poll.service';
import { PollBlockchain } from '../../../../core/PollBlockchain';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  poll: PollBlockchain;
  pollJSON: string;
  currentVote: string;
  currentVotes: string[] = [];
  ballotCode: string;
  textToCalculateHash: string;
  previousHash: string;
  textToCalculateHashNormalized: string;
  calculatedHash: string
  username: string
  errorMessage: string

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
        this.currentVotes = new Array(this.poll.pollQuestions.length)
        this.pollJSON = JSON.stringify(poll, undefined, 2)
        localStorage.setItem("BLOCKCHAIN_POLL_"+ id, this.pollJSON);
      });
  }

  vote(): void {
    this.errorMessage = ""
    this.pollService.vote({'pollId': this.poll.id , 'ballotCode': this.ballotCode, 'votes': this.currentVotes}).subscribe(
      r => this.getPoll(),
      err => this.errorMessage = err.error.message
    )
  }

  mine(): void {
    this.pollService.mine(this.poll.id).subscribe(
      r => this.getPoll()
    )
  }

  validate(): void {
    this.textToCalculateHashNormalized = JSON.stringify(JSON.parse(this.textToCalculateHash));
    // this.calculatedHash = sha256(this.textToCalculateHashNormalized+ this.previousHash);
  }

}
