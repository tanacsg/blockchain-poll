import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../poll.service';
import { PollBlockchain } from '../../../../core/PollBlockchain';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  poll: PollBlockchain;
  pollJSON: string;
  currentVote: string;

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
        this.pollJSON = JSON.stringify(poll, undefined, 2)
      });
  }
  
  vote(): void {    
    this.pollService.vote({'pollId': this.poll.id , 'votes': [this.currentVote]}).subscribe(
      r => this.getPoll()
    )
  }

  mine(): void {
    this.pollService.mine(this.poll.id).subscribe(
      r => this.getPoll()
    )
  }

}
