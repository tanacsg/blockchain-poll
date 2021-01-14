import { Component, OnInit } from '@angular/core';
import { PollBlockchain } from '../../../../../core/PollBlockchain';

@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css']
})
export class PollEditComponent implements OnInit {

  poll: PollBlockchain;
  
  constructor() { }

  ngOnInit(): void {
      this.poll = new PollBlockchain("", "", []);
  
  }
  save(): void {

    alert(JSON.stringify(this.poll));
  } 

}
