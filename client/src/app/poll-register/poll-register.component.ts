import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollBlockchain } from '../../../../core/PollBlockchain';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll-register',
  templateUrl: './poll-register.component.html',
  styleUrls: ['./poll-register.component.css']
})
export class PollRegisterComponent implements OnInit {

  poll: PollBlockchain;
  pollJSON: string;
  ballotCode: string;
  username: string;
  errorMessage: string;

  constructor( private pollService: PollService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getPoll()

  }

  getPoll(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollService.getPoll(id)
      .subscribe(poll => {
        this.poll = poll;
        this.pollJSON = JSON.stringify(poll, undefined, 2)
        localStorage.setItem("BLOCKCHAIN_POLL_"+ id, this.pollJSON);
      });
  }

  register(): void {
    this.ballotCode = ""
    this.errorMessage = ""
    this.pollService.register(this.poll.id, this.username).subscribe(
      r => {
        this.getPoll()
        this.ballotCode = r.ballotCode
      },
      err => this.errorMessage = err.error.message
    )
  }

  mine(): void {
    this.pollService.mine(this.poll.id).subscribe(
      r => this.getPoll()
    )
  }

}
