import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-start',
  templateUrl: './poll-start.component.html',
  styleUrls: ['./poll-start.component.css']
})
export class PollStartComponent implements OnInit {

  pollIdToRegister: string
  pollIdToVote: string
  errorMessage: string

  constructor(private router: Router ) { }

  register(): void {
    this.router.navigate(['/register', this.pollIdToRegister])
  }

  vote(): void {
    this.router.navigate(['/vote', this.pollIdToRegister])
  }

  ngOnInit(): void {
  }

}
