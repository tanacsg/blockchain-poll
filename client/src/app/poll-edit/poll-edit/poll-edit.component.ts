import { Component, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";

import { PollService } from 'src/app/poll.service';
import { PollBlockchain } from '../../../../../core/PollBlockchain';

@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css']
})
export class PollEditComponent implements OnInit {

  poll: PollBlockchain;
  serverMessage: string;
  confirmedPollId: string

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
    this.poll = new PollBlockchain("", "", []);

  }

  save(): void {

    this.confirmedPollId = null
    this.pollService.create(this.poll).subscribe(o => {

      console.log(o.message);
      this.serverMessage = o.message;
      this.confirmedPollId = o.id
    }, err => {
      this.serverMessage = err.error.message;
      console.log(err)
    });

  }

  onAddPoll(form: NgForm) {
      console.log(form.value)
      this.poll.id = form.value.pollId;
      this.poll.name = form.value.pollName;
      this.save()
  }

}
