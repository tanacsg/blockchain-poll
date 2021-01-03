import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../poll.service';
import { BlockchainPoll } from '../../../../core/BlockchainPoll';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {
  poll: BlockchainPoll;
  currentVote: string = 'My Vote 2';

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
      });
  }
  
  vote(): void {    
    this.pollService.vote({'pollId': this.poll.id , 'votes': [this.currentVote]}).subscribe(
      r => console.log(r)
    )
  }

}
