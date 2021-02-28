import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from "@angular/forms";
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';

import { PollService } from 'src/app/poll.service';
import { PollBlockchain, PollQuestion } from '../../../../core/PollBlockchain';

import { Location, LocationStrategy, DOCUMENT } from '@angular/common';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';


@Component({
  selector: 'app-poll-edit',
  templateUrl: './poll-edit.component.html',
  styleUrls: ['./poll-edit.component.css']
})
export class PollEditComponent implements OnInit {

  poll: PollBlockchain;
  serverMessage: string;
  serverErrorMessage: string;
  confirmedPollId: string;
  baseUrl: string
  registerUrl: string
  voteUrl: string

  constructor(private pollService: PollService, private location: Location, private locationStrategy: LocationStrategy, @Inject(DOCUMENT) private document: Document, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.poll = new PollBlockchain("", "");
    this.baseUrl = this.document.location.origin + this.locationStrategy.getBaseHref()
  }

  save(): void {

    this.confirmedPollId = null
    this.serverMessage = null
    this.serverErrorMessage = null

    this.pollService.create(this.poll).subscribe(o => {

      console.log(o.message);
      this.serverMessage = o.message;
      this.confirmedPollId = o.id
      this.registerUrl = this.baseUrl + "register/" + this.confirmedPollId
      this.voteUrl = this.baseUrl + "poll/" + this.confirmedPollId

    }, err => {
      this.serverErrorMessage = err.error.message;
      console.log(err)
    });

  }

  addNewOption(question: PollQuestion): void {
    question.options.push("")
  }

  addNewQuestion(): void {
    this.poll.pollQuestions.push(new PollQuestion("", ["", ""]))
  }

  onOptionUpdate(value: string, i: number, j: number): void {
    this.poll.pollQuestions[i].options[j] = value
  }


  help() {
    this.dialog.open(HelpDialogComponent);
  }
}
