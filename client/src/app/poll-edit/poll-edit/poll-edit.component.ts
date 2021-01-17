import { Component, OnInit } from '@angular/core';
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

  constructor(private pollService: PollService) { }

  ngOnInit(): void {
    this.poll = new PollBlockchain("", "", []);

  }

  save(): void {

    this.pollService.create(this.poll).subscribe(o => {

      console.log(o.message);
      this.serverMessage = o.message;
    }, err => {
      this.serverMessage = err.error.message;
      console.log(err)
    });

  }

}
