import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  polls: any[];

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
    this.getPolls();
  }

  getPolls(): void {
    this.pollService.getPolls()
    .subscribe(polls => this.polls = polls);
  }

}
