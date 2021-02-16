import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../poll.service';
import { PollBlock, PollBlockchain, PollQuestion } from '../../../../core/PollBlockchain';
import { PollBlockchainService, ValidationResult } from '../../../../core/PollBlockchainService';

import { NgxChartsModule } from '@swimlane/ngx-charts';

const sha256 = require('sha256');

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.css']
})
export class VoteComponent implements OnInit {

  private pollBlockchainService: PollBlockchainService
  poll: PollBlockchain;
  pollJSON: string;
  pollJSONLocalBackup: string
  currentVote: string;
  currentVotes: string[] = [];
  ballotCode: string;
  textToNormalize: string;
  textToHash: string;
  normalizationError: string
  calculatedHash: string
  username: string
  errorMessage: string
  successMessage: string
  voteReceipt: String
  file: any;
  formatJSONLocalBackupError: string
  blockComparisionStatusMessage: string
  validationResult: ValidationResult
  allVotes = []
  allVotesMap = {}
  pollDataForDiagram = []
  pollQuestionsForDiagram = []


  constructor(
    private pollService: PollService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.pollBlockchainService = new PollBlockchainService()
    this.getPoll()
  }

  getPoll(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.pollService.getPoll(id)
      .subscribe(poll => {
        this.poll = poll;
        this.pollJSON = JSON.stringify(this.poll, undefined, 2)
      });
  }

  storePollInBrowser(): void {
    localStorage.setItem("BLOCKCHAIN_POLL_" + this.poll.id, this.pollJSON);
  }

  loadFromBrowser(): void {
    this.pollJSONLocalBackup = localStorage.getItem("BLOCKCHAIN_POLL_" + this.poll.id);
  }

  uploadLocalBackup(): void {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log(fileReader.result);
      this.pollJSONLocalBackup = fileReader.result.toString()
    }
    fileReader.readAsText(this.file);
  }

  fileChanged(e) {
    this.file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e2) => {
      this.pollJSONLocalBackup = fileReader.result.toString()
    }
    fileReader.readAsText(this.file);
  }

  formatJSONLocalBackup() {
    this.formatJSONLocalBackupError = ""
    try {
      this.pollJSONLocalBackup = JSON.stringify(JSON.parse(this.pollJSONLocalBackup), undefined, 2)
    } catch (e) {
      console.log(e)
      this.formatJSONLocalBackupError = "Invalid JSON"
    }
  }

  compareBlocks() {
    let pollLocalBackup: PollBlockchain
    try {
      pollLocalBackup = JSON.parse(this.pollJSONLocalBackup)
    } catch (e) {
      this.blockComparisionStatusMessage = 'Invalid locak blockchain backup'
      return
    }
    let localChainLength = pollLocalBackup.chain.length
    this.blockComparisionStatusMessage = ''

    for (let i = 0; i < localChainLength; i++) {
      if (JSON.stringify(pollLocalBackup.chain[i]) != JSON.stringify(this.poll.chain[i])) {

        this.blockComparisionStatusMessage = "Local block with index: " + pollLocalBackup.chain[i].index + " seems to be different, comparision process stopped.";
        break;
      }
    }
    if (this.blockComparisionStatusMessage === '') {
      this.blockComparisionStatusMessage = 'Local blocks are all contained identically in the blockchain blocks from the server'
    }
  }

  vote(): void {
    this.errorMessage = ""
    this.successMessage = ""
    this.voteReceipt = ""
    this.pollService.vote({ 'pollId': this.poll.id, 'ballotCode': this.ballotCode, 'votes': this.currentVotes }).subscribe(
      r => {
        this.successMessage = "Your vote has been casted. Your receipt is technically sha256(ballotCode + stringified votes array)), with that you can verify that your vote is counted. Your receipt:"
        this.voteReceipt = r.receipt
        this.getPoll()
      },
      err => this.errorMessage = err.error.message
    )
  }

  mine(): void {
    this.errorMessage = ""
    this.pollService.mine(this.poll.id).subscribe(
      r => this.getPoll()
    )
  }

  countVotes(): void {
    this.pollDataForDiagram = this.pollBlockchainService.countVotes(this.poll)
  }

  validateBlockChain(): void {
    this.validationResult = this.pollBlockchainService.validate(this.poll)
  }

  calculateHash(): void {
    this.calculatedHash = sha256(this.textToHash);
  }

  normalize(): void {
    try {
      this.normalizationError = ""
      this.textToNormalize = JSON.stringify(JSON.parse(this.textToNormalize));
    } catch (e) {
      this.normalizationError = "Invalid JSON"
    }
  }

}
