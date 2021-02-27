import { Component, OnInit } from '@angular/core';
import { PollService } from '../poll.service';

@Component({
  selector: 'app-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.css']
})
export class PollComponent implements OnInit {
  polls: any[];
  adminPassword: string;
  errorMessage: string;

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
  }

  getPolls(): void {
    this.errorMessage = ''
    this.pollService.getPolls('admin',this.adminPassword)
    .subscribe(polls => this.polls = polls, err => {
      this.extractErrorMessage(err);
    });
  }

  delete(id: string): void {
    this.errorMessage = ''
    this.pollService.delete(id, 'admin', this.adminPassword)
    .subscribe(r => {
      console.log("deleted: "+ r)
      this.getPolls();
    }, err => {
      this.extractErrorMessage(err);
    });
  }

  extractErrorMessage(err: any): void {
    console.log(err)

    if (err.message) {
      this.errorMessage = err.message
    }

    if (err.statusText) {
      this.errorMessage = err.statusText
    }
    if (!this.errorMessage) {
      this.errorMessage = "Error in Server"
    }
  }
}
