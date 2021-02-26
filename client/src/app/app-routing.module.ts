import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PollEditComponent } from './poll-edit/poll-edit.component';
import { PollRegisterComponent } from './poll-register/poll-register.component';
import { PollStartComponent } from './poll-start/poll-start.component';
import { PollComponent } from './poll/poll.component';
import { VoteComponent } from './vote/vote.component';

const routes: Routes = [
  { path: '', redirectTo: '/start', pathMatch: 'full' },
  { path: 'start', component: PollStartComponent },
  { path: 'list', component: PollComponent },
  { path: 'poll/new', component: PollEditComponent },
  { path: 'register/:id', component: PollRegisterComponent },
  { path: 'poll/:id', component: VoteComponent },
  { path: 'vote/:id', component: VoteComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
