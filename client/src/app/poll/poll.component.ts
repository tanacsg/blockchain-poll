import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  polls: any[];
  myText: string[] = ["Alma", "KOrte"];
  text: any;

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
    this.getPolls();
  }

  getPolls(): void {
    this.pollService.getPolls()
    .subscribe(polls => this.polls = polls);
  }

  vote(pollId: string, votes: string ): void {
    this.pollService.vote({'pollId': pollId, 'votes': votes.split(',')})
    .subscribe(o => {

      console.log(o);
    }, err => {
      console.log(err)
    });
  }

}
